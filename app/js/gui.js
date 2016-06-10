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

	send: (command) => {
		ipcRenderer.send('control', command)
	},

	downloads: {
		addTorrentModal: ()=> {
			$('#addModal').modal('toggle')
			$('#tb-add-folder').val(settings.dir_downloads)
		},

		cast: ()=> {
			alert("cast file")
		},

		share: ()=> {
			alert("share file")
		},

		getDialogFile: ()=> {
			let config = {	title: 'Please select a torrent',
							filters: [{ name: 'Torrents', extensions: ['torrent'] }],
							defaultPath: settings.dir_downloads,
							properties: ['openFile']
						 }

			dialog.showOpenDialog(config, name => $('#tb-add-file').val(name))	
		},

		getDialogFolder: ()=> {
			let config = {  title: 'Please select a folder',
							defaultPath: settings.dir_downloads,
							properties: ['openDirectory', 'createDirectory']
						 }		

			dialog.showOpenDialog(config, name => $('#tb-add-folder').val(name))	
		},


	},

	channels: {
		open :()=> {
			gui.changePage('channels')
			if(settings.channels_warning) $('#modal_alert').modal('show')
			channels.load()
		}, 	

		closeAlert :()=> {
			$('#modal_alert').modal('hide')
			settings.channels_warning = false
		},
	},
	
	settings: {
		open :()=> {
			$('#modal_setting').modal('toggle')
		},
	},

}