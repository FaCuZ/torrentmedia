module.exports = {
	all: null,
	installed: null,
	load: ()=> {
		$('#channels-web').html('')
		glob('./channels/*.json', (er, files) => {			
			files.forEach(file => { 
				let channel = require(Path.resolve(file))
				$('#channels-web').append(channels.html(channel))
				console.log(channel)
			})
		})
	},

	parseXml: file => {
		return XML.parse(require(Path.resolve(file)))
	},

	html: channel => {
		let color = "info"
		let icon = "general"

		switch(channel.type) {
			case 'rss':
				color = "orange"
				icon = "rss"
				break
			case 'html':
				color = "teal"
				icon = "html5"
				break
		} 

		return `<div class="col-md-3 col-sm-6 col-xs-12">
					<div class="info-box channel-box" onclick="call.btn_channel('${channel.name}')">
						<span class="info-box-icon bg-${color}"><i class="fa fa-${icon}"></i></span>

						<div class="info-box-content">
						  <span class="info-box-text">${channel.name}</span>
						  <span class="info-box-number">${channel.type}</span>
						</div>
					</div>
				</div>`
	},

	gui: {
		open: ()=> {
			gui.changePage('channels')
			if(settings.channels_warning) $('#modal_alert').modal('show')
			channels.load()
		}, 	

		closeAlert: ()=> {
			$('#modal_alert').modal('hide')
			settings.channels_warning = false
		},

	},

}