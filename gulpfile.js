var gulp = require('gulp');
var jslint = require('gulp-jslint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var util = require('gulp-util');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');

var paths = {
  input: 'src/jquery.leaflet.js',
  output: {
    directory: 'dist',
    file: 'jquery.leaflet.js'
  }
};
var assumedVariables = ['require', 'jQuery', 'L'];

gulp.task('lint', function() {
  return gulp.src(paths.input)
    .on('error', util.log)
    .pipe(plumber())
    .pipe(jslint({
      predef: assumedVariables,
      global: assumedVariables,
      this: true,
      white: true,
      devel: true
    }))
    .pipe(jslint.reporter('default'));
});

gulp.task('build', function() {
  return browserify(paths.input)
    .bundle()
    .on('error', util.log)
    .pipe(source(paths.output.file))
    .pipe(buffer())
    .pipe(gulp.dest(paths.output.directory))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.output.directory));
});

gulp.task('watch', function() {
  gulp.watch(paths.input, ['lint', 'build']);
});

gulp.task('default', ['watch']);
