/*eslint-env node */

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');

gulp.task('default', ['copy-html', 'copy-images', 'styles', 'scripts'], function () {
  gulp.watch('sass/**/*.scss', ['styles']);
  gulp.watch('/index.html', ['copy-html']);
  gulp.watch('/restaurant.html', ['copy-html']);
  gulp.watch('./dist/index.html').on('change', browserSync.reload);
  gulp.watch('./dist/restaurant.html').on('change', browserSync.reload);

  browserSync.init({
    server: './dist'
  });
});

gulp.task('dist', [
  'copy-html',
  'copy-images',
  'styles',
  'scripts-dist'
]);

gulp.task('scripts', function () {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function () {
  gulp.src('js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function () {
  gulp.src('./index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function () {
  gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function () {
  gulp.src('sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});