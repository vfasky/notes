"use strict";

var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var through2 = require('through2');
var crypto = require('crypto');
var fs = require('fs');

var staticRoot = path.join(__dirname, '../static/');

var md5 = function(text){
    return crypto.createHash('md5').update(String(text)).digest('hex');
};

var saveHash = function(){
    var filePath = path.join(__dirname, 'hash.json');

    return through2.obj(function(file, enc, callback) {
        var uri = file.path.replace(staticRoot, '');
        //console.log(file.path);
        var has = md5(file.content).substring(0, 6);

        var _hash = JSON.parse(fs.readFileSync(filePath), 'utf8');

        _hash[uri] = has;
        
        fs.writeFileSync(filePath, JSON.stringify(_hash, null, 4), 'utf8');

        callback(null, file);
    });
};

gulp.task('less', function () {
    gulp.src([
        path.join(staticRoot, 'less/*.less'),
        '!'+ path.join(staticRoot, 'less/_*.less')
    ])
    .pipe(less({
        //compress: true,
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
});

gulp.task('default', ['less', 'watch']);