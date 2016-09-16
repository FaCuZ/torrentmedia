module.exports = {

	changePage: type => {
		$('.content-wrapper').hide()
		$('.content-wrapper-' + type).show()
		$('.sidebar-menu li').removeClass('active')
		$('#btn_nav_' + type).addClass('active')	
	},

	sidebarToggle: ()=> {
		$('.sidebar-footer').toggle()
	},

	searchTorrent: () => {
		shell.openExternal(settings.searchers[settings.search_with] + $('#tb-search').val())
	},

	setTray: (blink, color) => {
		settings.tray_blink = blink
		settings.tray_color = color
	},

	send: command => {
		ipcRenderer.send('control', command)
	},

	fixRatio: ratio => {
		if(ratio > 1000) return "&infin;"
		return Humanize.formatNumber(ratio, 2)
	},

	
	progressBar: (progress, element, torrent = null) =>{ 

		let size = element.find('.progress').outerWidth()
		let style = ''	

		if(torrent){
			style = 'progress-bar-info progress-bar-striped'
			if(torrent.done) style = 'progress-bar-success' 
			else if(torrent.paused) style = 'progress-bar-warning' 
			else if(torrent.ready) style = ''
		}

		// FIX: Cambiar para que no regenere toda la barra todo el tiempo
		return `<div class="progress">
					<span class="p-black" style="width: ${size}px;">${progress}%</span>
					<div class="progress-bar ${style}" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${progress}%;">
						<span class="p-white" style="width: ${size}px;">${progress}%</span>
					</div>
				</div>
				`
	},

	generalFoot: ()=> {	
		let pb = gui.progressBar((client.progress * 100).toFixed(1), $('.main-footer'))
		let ds = Humanize.fileSize(client.downloadSpeed) + '/s'
		let us = Humanize.fileSize(client.uploadSpeed) + '/s'
		let ra = gui.fixRatio(client.ratio)
		let o = ""
		if(ra <= 1) o = "-o"

		return `<div class="row">
					<div class="col-md-10">
						<span class="ft-cell"><i class="fa fa-fw fa-arrow-down"></i> ${ds} </span>
						<span class="ft-cell"><i class="fa fa-fw fa-arrow-up"></i> ${us} </span>
						<span class="ft-cell"><i class="fa fa-fw fa-heart${o}"></i> ${ra} </span>
					</div>
					<div class="col-md-2">${pb}</div>
				</div>
				` 	
	},
	
	alpha: ()=> {
		alert(locale.alpha)			
	}

}