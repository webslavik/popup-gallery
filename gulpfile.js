'use strict';

const gulp = require('gulp'),
	  pug = require('gulp-pug'),
	  sass = require('gulp-sass'),
	  autoprefixer = require('gulp-autoprefixer'),
	  cleanCSS = require('gulp-clean-css'),
	  gcmq = require('gulp-group-css-media-queries'),
	  uglify = require('gulp-uglify'), // minify js
	  babel = require('gulp-babel'),
	  rename = require('gulp-rename'),
	  notify = require("gulp-notify"), // show errors
	  del = require('del'),
	  browserSync = require('browser-sync');



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
	return gulp.src('src/sass/*.scss')
		.pipe(sass()).pipe(sass())
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


gulp.task('build', ['clean', 'sass'], function() {
	let buildJS = gulp.src('src/js/*.js')
		.pipe(babel({presets: ['es2015']}))
		.pipe(uglify())
		.pipe(rename({
            suffix: '.min'
        }))
		.pipe(gulp.dest('dist/'));

	let buildStyle = gulp.src('src/sass/skyslider.scss')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('dist/'));
});


gulp.task('watch', ['browser-sync',  'sass', 'pug'], function() {
	gulp.watch('src/sass/**/*', ['sass']);
	gulp.watch('src/pug/**/*.pug', ['pug']);
	gulp.watch('src/js/**/*', browserSync.reload);
	gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('default', ['watch']);