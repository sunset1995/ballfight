const fs = require('fs');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const browserify = require("browserify");
const babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');


gulp.task('default', () => {

    browserify('src/main.js')
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('./main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./'));

});


gulp.task('debug', () => {
    
    browserify('src/main.js', {
            debug: true
        })
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('./main.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./'));

});
