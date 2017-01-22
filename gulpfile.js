var gulp = require('gulp');
var uglify = require('gulp-uglify')
var browserify = require('gulp-browserify');
var babel = require('gulp-babel');



gulp.task('default', ['main']);
gulp.task('debug', ['main-debug']);


gulp.task('main', () => {
    return gulp.src('src/main.js')
        .pipe(browserify())
        .pipe(babel({
            presets: ['es2015'],
            compact: true,
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./'));
});

gulp.task('main-debug', () => {
    return gulp.src('src/main.js')
        .pipe(browserify({
            debug: true,
        }))
        .pipe(babel({
            presets: ['es2015'],
            compact: false,
        }))
        .pipe(gulp.dest('./'));
});
