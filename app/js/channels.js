module.exports = {
	all: null,
	_files: null,
	load :()=> {
		console.log("load")
		glob('./channels/*.json', (er, files) => {
			_files = files
			console.log(_files)
			files.forEach(file => { 
				console.log(Path.resolve(file))
				$('#channels-web').append(channels.content(file))
			})
			//require( path.resolve( file ) )
		});
	},

	content:  data => {
		//return "<h3>"+data.name+"</h3>"

		return `<div class="col-md-3 col-sm-6 col-xs-12">
					<div class="info-box">
						<span class="info-box-icon bg-aqua"><i class="fa fa-image"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">${data}</span>
						  <span class="info-box-number">90<small>%</small></span>
						</div>
					</div>
				</div>`
	}

}