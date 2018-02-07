const gulp = require('gulp')
const sass = require('gulp-ruby-sass')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const uglify = require('gulp-uglify')
const fileinclude = require('gulp-file-include')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

// 清空dist目录
gulp.task('clear', () => {
  del.sync('./dist')
})

// 编译sass并生成map
gulp.task('sass', () => {
  sass('./app/sass/*.scss', { 'style': 'expanded', sourcemap: true })
    .on('error', sass.logError)
    .pipe(sourcemaps.write('maps', {
      includeContent: false,
      sourceRoot: './app/sass'
    }))
    .pipe(gulp.dest('./dist/css'))
})

// 压缩js
gulp.task('jsmin', () => {
  gulp.src('./app/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js'))
})

// 整合html
gulp.task('html', () => {
  gulp
    .src('./app/src/*.html')
    .pipe(fileinclude())
    .pipe(gulp.dest('./dist'))
})

// 复制文件
gulp.task('copy', () => {
  gulp
    .src('./app/images/**/**/*')
    .pipe(gulp.dest('./dist/images'))
})

// 启动服务
gulp.task('server', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    port: 8088
  })
  // 监听目录
  gulp.watch('./app/sass/*.scss', ['sass'])
    .on('change', reload)
  gulp.watch('./app/src/**/*.html', ['html'])
    .on('change', reload)
  gulp.watch('./app/js/**/*.js', ['jsmin'])
    .on('change', reload)
})

gulp.task('default', ['clear', 'sass', 'jsmin', 'html', 'copy', 'server'])