var gulp = require('gulp'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	run = require('gulp-run-electron'),
	del = require('del')

var paths = {
	scripts:[
			 './node_modules/admin-lte/bootstrap/js/bootstrap.min.js', // Bootstrap 3.3.5
			 './node_modules/admin-lte/dist/js/app.min.js', // AdminLTE
			 './node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js', // SlimScroll 1.3.0
			 './node_modules/admin-lte/plugins/fastclick/fastclick.min.js', // FastClick
			 //'./node_modules/admin-lte/plugins/datatables/jquery.dataTables.min.js', // DataTables
			 //'./node_modules/admin-lte/plugins/datatables/dataTables.bootstrap.min.js'
			],
	styles: 'css/**/*.css',
	app:	[
			 'package.json',
			 'app/**/*'
			],
	}


gulp.task('clean', function() {
	return del(['dist'])
})

gulp.task('scripts', ['clean'], function() {
	return  gulp.src(paths.scripts)
				.pipe(concat('libs.js'))
				.pipe(gulp.dest('dist/js/'));
});

gulp.task('copy', ['clean'], function (){
	gulp.src(paths.app)
		.pipe(gulp.dest('dist/'))
})

gulp.task('run', ['copy', 'scripts'], function(){
	return gulp.src("dist").pipe(run())
})

gulp.task('default', ['run'])