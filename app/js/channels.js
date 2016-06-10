module.exports = {
	all: null,
	load :()=> {
		$('#channels-web').html('')
		glob('./channels/*.json', (er, files) => {			
			files.forEach(file => { 
				let channel = require(Path.resolve(file))
				$('#channels-web').append(channels.html(channel))
				console.log(channel)
				/*
				var doc = XML.parse( require( Path.resolve(file) ) )
				console.log( doc )
				*/
			})
			//require( path.resolve( file ) )
		});
	},

	html:  channel => {
		return `<div class="col-md-3 col-sm-6 col-xs-12">
					<div class="info-box">
						<span class="info-box-icon bg-aqua"><i class="fa fa-image"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">${channel.name}</span>
						  <span class="info-box-number"><small>${channel.type}</small></span>
						</div>
					</div>
				</div>`
	}

}