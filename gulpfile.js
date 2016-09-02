/**
 * Gulp配置文件
 * @authors zeke (you@example.org)
 * @date    2016-06-16 17:22:59
 * @version $Id$
 */

var gulp = require("gulp"),
    mergestream = require('merge-stream'),
    cache = require('gulp-cache'),
    plugins = require('gulp-load-plugins')();

var tinylr = require('tiny-lr'),
    server = tinylr(),
    port = 35729;

var paths = {
    scripts: ['src/jquery-2.2.0.js', 'src/rem.js', 'src/jquery.scrollstop.js'],
    images:['src/*.png'],
    css:['src/*.css']
};

var option = {
    buildPath: "dist"
};

gulp.task('help', function() {
  console.log('	gulp build			文件打包');
  console.log('	gulp watch			文件监控打包');
  console.log('	gulp help			gulp参数说明');
});


// 清空图片、样式、js
gulp.task('clean', function() {
    return gulp.src([option.buildPath+"/*"], {
            read: false
        }).pipe(plugins.clean({
            force: true
        })).pipe(plugins.notify({ message: 'Clean task complete' }));
});

// 复制文件
gulp.task('copy', function() {
    gulp.src(['*.html']).pipe(gulp.dest(option.buildPath+'/'));
    gulp.src(paths.scripts,{ base: 'src' }).pipe(gulp.dest(option.buildPath+'/src'));
});

// Copy all static images
gulp.task('imagemin', function() {
 return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(plugins.imagemin({optimizationLevel: 5,progressive: true,interlaced: true}))
    .pipe(gulp.dest(option.buildPath+'/src'));
});

// Optimize styles
gulp.task('cssmin', function() {
    gulp.src(paths.css)
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest(option.buildPath+'/src'));
});


gulp.task("jsmin", function() {
  gulp.src(["src/mobilecalendar.js"])
    .pipe(plugins.uglify())
    .pipe(gulp.dest(option.buildPath+"/src"));
});


gulp.task('build', ['clean'],function(){
    gulp.start('copy','imagemin','jsmin', 'cssmin');
});

// 注册缺省任务
gulp.task('default',function(){
    gulp.start('help');
});