var gulp = require('gulp'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	run = require('gulp-run-electron'),
	del = require('del')

var paths = {
	scripts:[
			'./node_modules/admin-lte/bootstrap/js/bootstrap.min.js', 				//> Bootstrap 3.3.5
			'./node_modules/admin-lte/dist/js/app.min.js', 							//> AdminLTE
			'./node_modules/admin-lte/plugins/slimScroll/jquery.slimscroll.min.js',	//> SlimScroll 1.3.0
			'./node_modules/admin-lte/plugins/fastclick/fastclick.min.js' 			//> FastClick
			],
	datatable:[
			  './node_modules/admin-lte/plugins/datatables/jquery.dataTables.min.js', 
			  './node_modules/admin-lte/plugins/datatables/dataTables.bootstrap.min.js'
			  ],
	styles: [
			'./node_modules/admin-lte/bootstrap/css/bootstrap.min.css',				//> Bootstrap 3.3.5 
			'./node_modules/admin-lte/plugins/datatables/dataTables.bootstrap.css',	//> DataTables
			'./node_modules/admin-lte/dist/css/AdminLTE.css' 						//> Theme style
			],
	app:	[
			 'package.json',
			 'app/**/*'
			],
	skins:	[
			 './node_modules/admin-lte/dist/css/skins/_all-skins.min.css'
			],
	}


gulp.task('clean', function() {
	return del(['dist'])
})

gulp.task('scripts', ['clean'], function() {
	return  gulp.src(paths.scripts)
				.pipe(concat('libs.js'))
				.pipe(gulp.dest('dist/js/'))
})

gulp.task('styles', ['clean'], function() {
	return  gulp.src(paths.styles)
				.pipe(concat('libs.css'))
				.pipe(gulp.dest('dist/css/'))
})

gulp.task('copy', ['clean'], function (){
	return  gulp.src(paths.app)
				.pipe(gulp.dest('dist/'))

})

gulp.task('skins', ['clean'], function (){
	return  gulp.src(paths.skins)
				.pipe(gulp.dest('dist/css/'))

})
	
gulp.task('run', ['copy', 'styles', 'skins', 'scripts'], function(){
	return 	gulp.src("dist")
				.pipe(run())
})

gulp.task('watch', ['run'], function(){
	gulp.watch('./app/**/*', [run.rerun])
})

gulp.task('default', ['run'])