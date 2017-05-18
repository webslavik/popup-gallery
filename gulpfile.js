'use strict';

const gulp 						= require('gulp'),
			pug 						= require('gulp-pug'),
			sass            = require('gulp-sass'),
			autoprefixer    = require('gulp-autoprefixer'),
			cleanCSS        = require('gulp-clean-css'), // минификация css
			gcmq 						= require('gulp-group-css-media-queries'), // объединение media queries
			uglify          = require('gulp-uglify'), // минифицируем js
			notify          = require("gulp-notify"), // выводим ошибки
			gulpif 					= require('gulp-if'),
			useref 					= require('gulp-useref'),
			del             = require('del'),
			browserSync     = require('browser-sync');



gulp.task('pug', function() {
	return gulp.src('src/pug/*.pug')
		.pipe(pug({
				pretty: true
		}))
		.on('error', notify.onError(function(err) {
			return {
				title: 'pug',
				message: err.message
			}
		}))
		.pipe(gulp.dest('src/'));
});


gulp.task('sass', function() {
	return gulp.src('src/sass/*.sass')
		.pipe(sass())
		.on('error', notify.onError(function(err) {
			return {
				title: 'Sass',
				message: err.message
			}
		}))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('src/css/'))
		.pipe(gcmq())
		.pipe(gulp.dest('src/css/'))
		.pipe(browserSync.reload({stream: true}));
});


gulp.task('browser-sync', function() {
	browserSync({
		server: {
				baseDir: 'src/'
		},
		notify: false
	});
});


gulp.task('clean', function() {
	return del.sync('dist');
});


gulp.task('build', ['clean', 'sass', 'pug'], function() {
		var buildHTML = gulp.src('src/*.html')
			.pipe(useref())
			// .pipe(gulpif('*.js', uglify()))
			.pipe(gulpif('*.css', cleanCSS()))
			.pipe(gulp.dest('dist/'));
});


gulp.task('watch', ['browser-sync',  'sass', 'pug'], function() {
	gulp.watch('src/sass/**/*', ['sass']);
	gulp.watch('src/pug/**/*.pug', ['pug']);
	gulp.watch('src/js/**/*', browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);