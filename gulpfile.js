var gulp 	= require('gulp'),
	watch 	= require('gulp-watch'),
	concat  = require('gulp-concat'),
	run 	= require('gulp-run-electron'),
	include = require('gulp-file-include')
	del 	= require('del')

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
	fonts:	[
			 './node_modules/font-awesome/fonts/*',
			 './node_modules/font-awesome/css/*'
			],
	skins:	[
			 './node_modules/admin-lte/dist/css/skins/_all-skins.min.css'
			],
}

////////////////////////
////////> Dist <////////
////////////////////////
gulp.task('dist:clean', function() {
	return del(['dist'])
})

gulp.task('dist:scripts', ['dist:clean'], function() {
	return  gulp.src(paths.scripts)
				.pipe(concat('libs.js'))
				.pipe(gulp.dest('dist/js/'))
})

gulp.task('dist:styles', ['dist:clean'], function() {
	gulp.src(paths.skins)
		.pipe(gulp.dest('dist/css/'))

	gulp.src(paths.styles)
		.pipe(concat('libs.css'))
		.pipe(gulp.dest('dist/css/'))
})

gulp.task('dist:copy', ['dist:clean'], function (){
	return  gulp.src(paths.app)
				.pipe(gulp.dest('dist/'))
})

gulp.task('dist:fonts', ['dist:clean'], function (){
	return  gulp.src(paths.fonts, { base: './node_modules/font-awesome/' })
				.pipe(gulp.dest('dist/icons/fonts/font-awesome/'))

})

gulp.task('dist', ['dist:copy', 'dist:styles', 'dist:fonts', 'dist:scripts'] )

////////////////////////
///////> relese <///////
////////////////////////
var version = "0.1.0-Alpha"

gulp.task('copile:clean', function() {
	del(['relese/' + version + '/'])
})


////////////////////////
///////> Basic <////////
////////////////////////
gulp.task('run', ['dist'], function(){
	return 	gulp.src("dist").pipe(run())
})

gulp.task('watch', ['run'], function(){
	return gulp.watch('./app/**/*', [run.rerun])
})

gulp.task('default', ['run'])