'use strict';

var gulp =          require('gulp'),
    autoprefixer =  require('gulp-autoprefixer'),
    concat =        require('gulp-concat'),
    notify =        require('gulp-notify'),
    uglify =        require('gulp-uglify'),
    sass =          require('gulp-sass');

var dir = {
  bower: './vendor',
  source: './src',
  dest: './public'
}

var config = {
  jsIncludePaths: [
    dir.bower + '/jquery/dist/jquery.js'
  ],
  sassIncludePaths: [
    dir.bower + '/bootstrap-sass-official/assets/stylesheets',
  ],
}

gulp.task('sass', function () {
  return gulp.src(dir.source + '/sass/styles.scss')
    .pipe(sass({
    outputStyle: 'compressed',
    includePaths: config.sassIncludePaths
  }).on("error", notify.onError(function (error) {
    return "Sass Compile Error: " + error.message;
  })))
    .pipe(autoprefixer('last 10 versions', 'ie 10'))
    .pipe(gulp.dest(dir.dest + '/css'));
});

gulp.task('js', function () {
  var srcPaths = config.jsIncludePaths.concat([
    dir.source + '/js/**/*.js',
  ]);
  return gulp.src(srcPaths)                 
    .pipe(concat('scripts.min.js')).on("error", notify.onError(function (error) {
    return "JS Concat Error: " + error.message;
  }))
    .pipe(uglify()).on("error", notify.onError(function (error) {
    return "JS Uglify Error: " + error.message;
  }))
    .pipe(gulp.dest(dir.dest + '/js'));
});

gulp.task('watch', function () {
  gulp.watch(dir.source + '/sass/**/*.scss', ['sass']);
  gulp.watch(dir.source + '/js/**/*.js', ['js']);
});