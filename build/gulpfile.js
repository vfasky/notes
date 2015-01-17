"use strict";

var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var rm = require('gulp-rm');

var path = require('path');
var through2 = require('through2');
var crypto = require('crypto');
var fs = require('fs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var appConfig = require('../config');

var staticRoot = path.join(__dirname, '../static/');
var mapFile = path.join(__dirname, 'map.json');

var md5 = function(text) {
    return crypto.createHash('md5').update(String(text)).digest('hex');
};


//保存文件 hash
var saveHash = function() {
    var filePath = path.join(__dirname, 'hash.json');

    return through2.obj(function(file, enc, callback) {
        var uri = file.path.replace(staticRoot, '');
        var soure = file.contents.toString('utf8');
        //console.log(file.path);
        var has = md5(soure).substring(0, 6);

        var _hash = JSON.parse(fs.readFileSync(filePath), 'utf8');

        _hash[uri] = has;

        fs.writeFileSync(filePath, JSON.stringify(_hash, null, 4), 'utf8');

        callback(null, file);
    });
};

//生成requirejs 的配置文件
var buildRequireConfig = function(pack) {
    if (!buildRequireConfig.config) {
        var configPath = path.join(__dirname, 'requirejs.config.json');
        buildRequireConfig.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }

    return through2.obj(function(file, enc, callback) {
        var soure = file.contents.toString('utf8');
        var has = md5(soure).substring(0, 6);
        var config = buildRequireConfig.config;
        file.path = file.path.replace(pack + '.all.js', pack + '.' + has + '.min.js');

        if (null === appConfig.staticHost) {
            config.paths[pack] = '/js/dist/' + pack + '.' + has + '.min';
        } else {
            config.paths[pack] = appConfig.staticHost + 'js/dist/' + pack + '.' + has + '.min';
        }

        //加入静态服务器前缀
        var staticHost = appConfig.staticHost || '';
        for (var k in config.paths) {
            if (config.paths[k].indexOf('//') !== 0 && config.paths[k].indexOf('http') !== 0) {
                config.paths[k] = staticHost + config.paths[k];
                //console.log(config.paths[k]);
            }
        }

        buildConfigJs(config);
        return callback(null, file);
    });
};

var buildConfigJs = function(config) {
    var configStr = 'require.config(' + JSON.stringify(config, null, 4) + ');';

    fs.writeFileSync(path.join(staticRoot, 'js/config.js'), configStr, 'utf8');
    fs.writeFileSync(mapFile, JSON.stringify(config.paths, null, 4), 'utf8');
    //config hash
    var has = md5(configStr).substring(0, 6);
    var filePath = path.join(__dirname, 'hash.json');
    var _hash = JSON.parse(fs.readFileSync(filePath), 'utf8');

    _hash['js/config.js'] = has;

    fs.writeFileSync(filePath, JSON.stringify(_hash, null, 4), 'utf8');
};

//删除目录下的js
var clearJs = function(jsPath) {

    fs.readdirSync(jsPath).forEach(function(fileName) {
        if (fileName.indexOf('.js') !== -1 &&
            fileName.indexOf('.') !== 0) {

            var filePath = path.join(jsPath, fileName);
            //console.log(filePath);
            fs.unlinkSync(filePath);
        }
    });
};

//监听模板
var watchTpl = function() {
    return through2.obj(function(file, enc, callback) {
        var paths = file.path.split(path.sep);
        paths.pop();
        var pack = paths[paths.length - 1];
        buildTpl(paths.join(path.sep), pack);

        return callback(null, file);
    });
};

//装html封装成amd
var buildTpl = function(tplPath, pack) {
    var tplSoure = {};
    var outPath = path.join(staticRoot, 'js/tpl');
    gulp.src(path.join(outPath, pack + '.' + '*.js'), {
            read: false
        })
        .pipe(rm({
            async: false
        }));

    if (!buildRequireConfig.config) {
        var configPath = path.join(__dirname, 'requirejs.config.json');
        buildRequireConfig.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    var config = buildRequireConfig.config;

    config.paths = JSON.parse(fs.readFileSync(mapFile, 'utf8'));

    fs.readdirSync(tplPath).forEach(function(tpl) {
        if (tpl.indexOf('.') === 0 || tpl.indexOf('.html') === -1) {
            return false;
        }
        tplSoure[tpl] = fs.readFileSync(path.join(tplPath, tpl), 'utf8')
            .replace(/\n/g, '')
            .replace(/\t/g, '')
            .replace(/\r/g, '');
    });

    var tpl = "define('tpl/" + pack + "', [], function(){ return " + JSON.stringify(tplSoure) + "; });";
    var has = md5(tpl).substring(0, 6);

    var tplName = pack + '.' + has;

    if (null === appConfig.staticHost) {
        config.paths['tpl/' + pack] = '/js/tpl/' + tplName;
    } else {
        config.paths['tpl/' + pack] = appConfig.staticHost + 'js/tpl/' + tplName;
    }

    fs.writeFileSync(path.join(outPath, tplName + '.js'), tpl, 'utf8');

    buildConfigJs(config);

};


//将所有 js 合成一份定义
var buildJs = function(pack) {
    var configPath = path.join(__dirname, 'build.config.json');
    var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return through2.obj(function(file, enc, callback) {
        var outPath = path.join(staticRoot, 'js/dist');
        gulp.src(path.join(outPath, pack + '.' + '*.all.js'), {
                read: false
            })
            .pipe(rm({
                async: false
            }));

            
        var soure = file.contents.toString('utf8');
        var jsPath = path.join(staticRoot, 'js/src', pack);
        var modules = [];
        //列出所有文件
        fs.readdirSync(jsPath).forEach(function(fileName) {
            if (fileName.indexOf('.js') !== -1 &&
                fileName.indexOf('.') !== 0) {
                var files = fileName.split('.');
                files.pop();
                modules.push(files.join('.'));
            }
        });
        var reqs = modules.map(function(v) {
            return '"' + pack + '/' + v + '"';
        });

        var safeModules = modules.map(function(v) {
            return '_' + v;
        });

        var def = [];
        def.push('define("' + pack + '", [' + reqs.join(', ') + '], function(' + safeModules.join(', ') + '){');
        def.push('    return {');
        var attr = [];
        modules.forEach(function(v) {
            if (config['function'].indexOf(pack + '/' + v) === -1) {
                //首字母大写
                var names = v.split('');
                names[0] = names[0].toUpperCase();
                attr.push('        "' + names.join('') + '" : _' + v);
            } else {
                attr.push('        "' + v + '" : _' + v);
            }
        });
        def.push(attr.join(',\n'));
        def.push('    };');
        def.push('});');

        file.contents = new Buffer(soure + '\n;\n' + def.join('\n'));

        callback(null, file);
    });
};

gulp.task('script', function() {
    //clearJs(path.join(staticRoot, 'js/dist'));

    var root = path.join(staticRoot, 'js/src');

    fs.readdirSync(root).forEach(function(dir) {
        if (dir.indexOf('.') === 0) {
            return false;
        }
        if (fs.statSync(path.join(root, dir)).isDirectory()) {
            var paths = [
                path.join(staticRoot, 'js/src/' + dir + '/*.js'),
            ];

            gulp.src(paths)
                //.pipe(watch(paths))
                .pipe(concat(dir + '.all.js'))
                .pipe(buildJs(dir))
                .pipe(gulp.dest(staticRoot + 'js/dist'))
                .pipe(uglify())
                .pipe(buildRequireConfig(dir))
                .pipe(gulp.dest(staticRoot + 'js/dist'));
        }
    });

});


gulp.task('less', function() {
    var paths = [
        path.join(staticRoot, 'less/*.less'),
        '!' + path.join(staticRoot, 'less/_*.less')
    ];

    gulp.src(paths)
        .pipe(watch(paths))
        .pipe(less({
            compress: true,
        }))
        .pipe(gulp.dest(staticRoot + 'css'))
        .pipe(saveHash());

});

gulp.task('tpl', function() {
    //clearJs(path.join(staticRoot, 'js/tpl'));
    var tplRoot = path.join(staticRoot, 'tpl');

    var paths = [
        path.join(staticRoot, 'tpl/**/*.html'),
    ];

    fs.readdirSync(tplRoot).forEach(function(dir) {
        if (dir.indexOf('.') === 0) {
            return false;
        }
        if (fs.statSync(path.join(tplRoot, dir)).isDirectory()) {
            var tplPath = path.join(tplRoot, dir);
            var pack = dir;
            buildTpl(tplPath, pack);
        }
    });

    watch(paths).pipe(watchTpl());
});

gulp.task('watch', function(){
    watch(path.join(staticRoot, 'js/src/**/*.js'), function(){
        gulp.start('script');
    });

});

gulp.task('default', ['less', 'script', 'tpl', 'watch']);
