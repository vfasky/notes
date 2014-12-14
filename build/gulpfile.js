"use strict";

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var through2 = require('through2');
var crypto = require('crypto');
var fs = require('fs');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

var appConfig = require('../config');

var staticRoot = path.join(__dirname, '../static/');

var md5 = function(text){
    return crypto.createHash('md5').update(String(text)).digest('hex');
};

//保存文件 hash
var saveHash = function(){
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
var buildRequireConfig = function(){
    var configPath = path.join(__dirname, 'requirejs.config.json');
    var config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    //console.log(appConfig);
    //console.log(config);

    return through2.obj(function(file, enc, callback) {
        var soure   = file.contents.toString('utf8');

        var has = md5(soure).substring(0, 6);
        file.path = file.path.replace('catke.all.js', 'catke.'+has+'.min.js');

        if(null === appConfig.staticHost){
            config.paths.catke = '/js/dist/' + 'catke.'+has+'.min';
        }
        else{
            config.paths.catke = appConfig.staticHost + 'js/dist/' + 'catke.'+has+'.min';
        }

        var configStr = 'require.config(' + JSON.stringify(config, null, 4) + ');';

        fs.writeFileSync(path.join(staticRoot, 'js/config.js'), configStr, 'utf8');

        //config hash
        var has = md5(configStr).substring(0, 6);
        var filePath = path.join(__dirname, 'hash.json');
        var _hash = JSON.parse(fs.readFileSync(filePath), 'utf8');

        _hash['js/config.js'] = has;
        
        fs.writeFileSync(filePath, JSON.stringify(_hash, null, 4), 'utf8');

        return callback(null, file);
    });
};

//删除目录下的js
var clearJs = function(jsPath){

    fs.readdirSync(jsPath).forEach(function(fileName){
        if(fileName.indexOf('.js') !== -1 && 
           fileName.indexOf('.') !== 0){

            var filePath = path.join(jsPath, fileName);
            //console.log(filePath);
            fs.unlinkSync(filePath);
        }
    }); 
};


//将所有 js 合成一份定义
var buildJs = function(){
    var configPath = path.join(__dirname, 'build.config.json');
    var config     = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    return through2.obj(function(file, enc, callback) {
        var soure   = file.contents.toString('utf8');
        var jsPath  = path.join(staticRoot, 'js/src');
        var modules = [];
        //列出所有文件
        fs.readdirSync(jsPath).forEach(function(fileName){
            if(fileName.indexOf('.js') !== -1 && 
               fileName.indexOf('.') !== 0){
                var files = fileName.split('.');
                files.pop();
                modules.push(files.join('.'));
            }
        });
        var reqs = modules.map(function(v){
            return '"catke/' + v + '"';
        });

        var safeModules = modules.map(function(v){
            return '_' + v ;
        });

        var def = [];
        def.push('define("catke", [' + reqs.join(', ') + '], function(' + safeModules.join(', ') + '){');
        def.push('    return {');
        var attr = [];
        modules.forEach(function(v){
            if(config['function'].indexOf('catke/' + v) === -1){
                //首字母大写
                var names = v.split('');
                names[0] = names[0].toUpperCase(); 
                attr.push('        "' + names.join('') + '" : _' + v);
            }
            else{
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

gulp.task('script', function(){
    clearJs(path.join(staticRoot, 'js/dist'));

    gulp.src([
        path.join(staticRoot, 'js/src/*.js'),
    ])
    .pipe(concat('catke.all.js'))
    .pipe(buildJs())
    .pipe(gulp.dest(staticRoot + 'js/dist')) 
    .pipe(uglify())
    .pipe(buildRequireConfig())
    .pipe(gulp.dest(staticRoot + 'js/dist'));
});


gulp.task('less', function () {
    gulp.src([
        path.join(staticRoot, 'less/*.less'),
        '!'+ path.join(staticRoot, 'less/_*.less')
    ])
    .pipe(less({
        compress: true,
        // paths: [
        // 	path.join(staticRoot, 'less/*.less'),
        // ]
    }))
    .pipe(gulp.dest(staticRoot + 'css'))
    .pipe(saveHash());
});


gulp.task('watch', function(){
    gulp.watch([
        staticRoot + 'less/*.less',
    ], ['less']);

    gulp.watch([
        staticRoot + 'js/src/*.js',
    ], ['script']);
});

gulp.task('default', ['less', 'script', 'watch']);