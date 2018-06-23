var gulp          = require('gulp');
var sass          = require('gulp-sass');
var autoprefixer  = require('gulp-autoprefixer');
var browserSync   = require('browser-sync').create();
var concat        = require('gulp-concat');

gulp.task('default', ['copy-html', 'copy-images', 'styles', 'scripts', 'copy-restaurant'], function () {
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/index.html', ['copy-html']);
  gulp.watch('src/restaurant.html', ['copy-restaurant']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('./dist/index.html').on('change', browserSync.reload);
  gulp.watch('./dist/restaurant.html').on('change', browserSync.reload);
  gulp.watch('./dist/js/**/*.js').on('change', browserSync.reload);
  gulp.watch('./dist/css/styles.css').on('change', browserSync.reload);

  browserSync.init({
    server: './dist'
  });
});

gulp.task('dist', [
  'copy-html',
  'copy-images',
  'styles',
  'scripts-dist',
  'copy-restaurant'
]);

gulp.task('scripts', function () {
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function () {
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function () {
  gulp.src('src/index.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-restaurant', function () {
  gulp.src('src/restaurant.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function () {
  gulp.src('img/*')
    .pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function () {
  gulp.src('src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});