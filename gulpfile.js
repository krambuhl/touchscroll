//gulp
var gulp = require('gulp');

// npm package
var pkg = require('./package.json');

// npm tools
var fs = require('fs');
var path  = require('path');
var slice = require('sliced');
var es = require('event-stream');

// gulp general plugins
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var refresh = require('gulp-livereload');
var cache = require('gulp-cache');
var source = require('vinyl-source-stream');
var map = require('map-stream');
var concatMaps = require('gulp-concat-sourcemap');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var handlebars = require('gulp-compile-handlebars');
var ftp = require('gulp-ftp');

// css tasks
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var cmq = require('gulp-combine-media-queries');
var minify = require('gulp-clean-css');

// js tasks
var uglify = require('gulp-uglify');

// browserify
var watchify = require('watchify');

// project directories
var sourceDir = './source';
var destDir = './dist';
var exDir = './example';

// filetype globs
var docGlob = '**/*.{js,css,sass,scss,json,md,html,hbs,handlebars}';
var rawGlob = '**/*.{js,css,sass,scss,md}';


// helper functions
function dir() { return slice(arguments).join('/'); }


// __styles__ task:
// - sass
// - autoprefixer
// - media query combiner
// - css minifier
gulp.task('styles', function() {
  return gulp.src(dir(exDir, 'sass/style.scss'))
    .pipe(sass({ style: 'expanded', errLogToConsole: true }))
    .pipe(autoprefix('last 3 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4', { cascade: true }))
    .pipe(gulp.dest(dir(exDir, 'sass')));
});



// __app__ task:
// - watchify
//   - watch app directory
//   - browserify
//     + output: 'app-bundle.js'

gulp.task('app', function() {
  var bundler = watchify(dir(sourceDir, pkg.name + '.js'), { debug: true });

  bundler.transform('brfs');
  bundler.on('update', rebundle);

  function rebundle () {
    return bundler.bundle()
      .pipe(source(pkg.name + '.js'))
      .pipe(gulp.dest(destDir));
  }

  return rebundle();
});

// __build__ task:
// compiles static templates with enviornment data
//
// - static handlebars
//   + output: various files to './dist/'
gulp.task('build', function() {
  var data = require(dir(exDir, 'data.json'));
  var options = {
    helpers : { }
  };

  return gulp.src(dir(exDir, 'index.hbs'))
    .pipe(handlebars(require(dir(exDir, 'data.json')), options))
    .pipe(rename('index.html'))
    .pipe(gulp.dest(exDir));
});


// __docs__ task:
// creates documentation from code in source folder using docco
//
// - docco (side by side documentation)
//   + output: various files to './docs'
gulp.task('docs', function() {
  return gulp.src(dir(sourceDir, rawGlob))
    .pipe(wrapDocco())
    .pipe(gulp.dest('./docs'));
});



// __watch__ task:
gulp.task('watch', function () {

  // run `app` task on js file changes in './source/app'
  gulp.watch(dir(sourceDir, '**/*.js'), ['app']);

    // run `app` task on js file changes in './source/app'
  gulp.watch(dir(exDir, '**/*.{json,html,hbs,handlebars}'), ['compile']);

  // run `styles` task on css file changes
  gulp.watch(dir(exDir, 'sass/**/*.{css,sass,scss}'), ['styles']);

  // run `docs` task on any file changes

  // gulp.watch([
  //   dir(exDir, docGlob),
  //   dir(sourceDir, docGlob),
  //   dir(testsDir, docGlob),
  //   'gulpfile.js',
  //   'README.md'
  // ], ['docs']);
});


gulp.task('upload', ['compile'], function () {
  return gulp.src(dir(destDir, '**/*'))
    .pipe(ftp(require('./ftp.json')));
});

// gulp.task('bump', function () {
//   return gulp.src(['./package.json', './bower.json'])
//     .pipe(bump())
//     .pipe(gulp.dest('./'));
// });


gulp.task('copy', []);

gulp.task('base', ['styles', 'app', 'copy']);
gulp.task('compile', ['base', 'build']);
gulp.task('default', ['compile', 'watch']);
