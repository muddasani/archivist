var browserify = require('browserify'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    babelify = require('babelify'),
    through2 = require('through2'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    importCSS = require('gulp-import-css'),
    minifyCSS = require('gulp-minify-css'),
    streamify = require('gulp-streamify'),
    source = require('vinyl-source-stream');


// Manager tasks
// -------------

gulp.task('manager-assets', function () {
  gulp.src('./src/manager/assets/**/*')
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('manager-bundle', function() {
  var bundler = browserify('./src/manager/index.js', {cache: {}, packageCache: {} }),
      bundle = function() {
        gulp.src('./src/manager/index.css')
          .pipe(importCSS())
          .pipe(minifyCSS({cache:true}))
          .pipe(rename("manager.css"))
          .pipe(gulp.dest('./public/manager'))
        bundler
          .bundle()
          .pipe(source('manager.js'))
          .pipe(streamify(uglify()))
          .pipe(gulp.dest('./public/manager'));
      };
  return bundle();
});

gulp.task('manager', ['manager-assets', 'manager-bundle']);

// Writer tasks
// -------------

gulp.task('writer-assets', function () {
  gulp.src('./src/writer/assets/**/*')
    .pipe(gulp.dest('./public/assets'));
});

gulp.task('writer-styles', function () {
  gulp.src('./src/writer/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename("writer.css"))
    .pipe(gulp.dest('./public/writer'));
});

gulp.task('writer-bundle', function () {
  return gulp.src('./src/writer/app.js')
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path)
        .transform(babelify)
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
          next(null, file);
        });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(rename('writer.js'))
    //.pipe(streamify(uglify()))
    .pipe(gulp.dest('./public/writer'));
});

gulp.task('writer', ['writer-assets', 'writer-styles', 'writer-bundle']);


// Reader tasks
// -------------

gulp.task('reader-styles', function () {
  gulp.src('./src/reader/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename("reader.css"))
    .pipe(gulp.dest('./public/reader'));
});

gulp.task('reader-bundle', function () {
  return gulp.src('./src/reader/app.js')
    .pipe(through2.obj(function (file, enc, next) {
      browserify(file.path)
        .transform(babelify)
        .bundle(function (err, res) {
          if (err) { return next(err); }
          file.contents = res;
          next(null, file);
        });
    }))
    .on('error', function (error) {
      console.log(error.stack);
      this.emit('end');
    })
    .pipe(rename('reader.js'))
    //.pipe(streamify(uglify()))
    .pipe(gulp.dest('./public/reader'));
});

gulp.task('reader', ['reader-styles', 'reader-bundle']);

gulp.task('default', ['manager', 'writer']);