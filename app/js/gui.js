module.exports = {
	addTorrentModal: () => {		
		$('#addModal').modal('toggle')
		$('#tb-add-folder').val(settings.dir_downloads)
	},

	changePage: type => {
		$('.content-wrapper').hide()
		$('.content-wrapper-' + type).show()
		$('.sidebar-menu li').removeClass('active')
		$('#btn_nav_' + type).addClass('active')	

		if(type == 'channels' && settings.channels_warning) $('.channels-alert').fadeIn()
	},

	closeAlert: () => {
		$('.channels-alert').fadeOut()
		//settings.channels_warning = false
	},

	searchTorrent: () => {
		shell.openExternal(settings.searchers[settings.search_with] + $('#tb-search').val())
	},

	getDialogFile: () => {
		let config = {	title: 'Please select a torrent',
						filters: [{ name: 'Torrents', extensions: ['torrent'] }],
						defaultPath: settings.dir_downloads,
						properties: ['openFile']
					 }

		dialog.showOpenDialog(config, name => $('#tb-add-file').val(name))	
	},

	getDialogFolder: () => {
		let config = {  title: 'Please select a folder',
						defaultPath: settings.dir_downloads,
						properties: ['openDirectory', 'createDirectory']
					 }		

		dialog.showOpenDialog(config, name => $('#tb-add-folder').val(name))	
	},

	setTray: (blink, color) => {
		settings.tray_blink = blink
		settings.tray_color = color
	},

	send: (command) => {
		ipcRenderer.send('control', command)
	}

}