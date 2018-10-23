var gulp = require('gulp'),
	uncss = require('gulp-uncss'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    clean = require('gulp-clean'),
    zip = require('gulp-zip'),
    unzip = require('gulp-unzip'),
	prefix = require('gulp-autoprefixer');
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber');

gulp.task('connect', function () {
	connect.server({
		root: 'app',
		livereload: true
	});
});

gulp.task('toZip', function () {
    gulp.src(['app/**/*.*', '!app/*.zip'])
        .pipe(zip('archive(READY).zip'))
        .pipe(gulp.dest('app'))
});

gulp.task('unZip', function(){
  gulp.src("start/*.zip")
    .pipe(unzip())
    .pipe(gulp.dest('start/'))
});

gulp.task('image', function () {
    gulp.src('start/images/**/*.*') //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('app/images')) //И бросим в build
        .pipe(connect.reload());
});

gulp.task('img', function () {
    gulp.src('start/img/**/*.*') //Выберем наши картинки
        .pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('app/img')) //И бросим в build
        .pipe(connect.reload());
});

gulp.task('unusedCss', function () {
    gulp.src('start/css/*.css')
        .pipe(uncss({
            html: ['app/index.html']
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});

gulp.task('css', function () {
    return gulp.src('start/css/*.css')
		.pipe(plumber({
                errorHandler: notify.onError(function(err){
                    return {
                        title: 'Styles',
                        message: err.message
                    }
                })
        }))
		.pipe(prefix('last 2 versions'))
        .pipe(gulp.dest('app/css'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
	gulp.src('start/index.html')
	.pipe(gulp.dest('app'))
	.pipe(connect.reload());
});

gulp.task('fav', function () {
    gulp.src('start/favicon.ico')
    .pipe(gulp.dest('app'))
    .pipe(connect.reload());
});

gulp.task('transit', function () {
    gulp.src('start/transit/**/*.*')
    .pipe(gulp.dest('app/transit'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src('start/js/*.js')
    .pipe(gulp.dest('app/js'))
    .pipe(connect.reload());
});

gulp.task('loc', function () {
    gulp.src('start/localization/*.*')
    .pipe(gulp.dest('app/localization'))
    .pipe(connect.reload());
});

gulp.task('fonts', function () {
    gulp.src('start/fonts/*.*')
    .pipe(gulp.dest('app/fonts'))
    .pipe(connect.reload());
});

gulp.task('toClean', function () {
    return gulp.src(['app/**/*.*', 'start/**/*.*', 'app/*', 'start/*'], {read: false})
        .pipe(clean());
});

gulp.task('watch', function () {
	gulp.watch('start/css/*.css', ['css'])
	gulp.watch('start/index.html', ['html'])
    gulp.watch('start/js/*.js', ['js'])
    gulp.watch('start/images/**/*.*', ['image'])
    gulp.watch('start/img/**/*.*', ['img'])
});

gulp.task('default', ['connect', 'img', 'image', 'css', 'html', 'js', 'loc', 'transit', 'fav','fonts', 'watch']);
