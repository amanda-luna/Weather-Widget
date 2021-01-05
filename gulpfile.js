const { src, dest, series} = require('gulp');
const concat = require('gulp-concat');
const minifyjs = require('gulp-minify');
const cssnano = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');

function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist'))
}

function jsTask() {
  return src('src/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(minifyjs())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/js'))
}

function cssTask() {
  return src('src/*.css')
    .pipe(sourcemaps.init())
    .pipe(concat('all.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
}

exports.default = series(htmlTask, jsTask, cssTask);