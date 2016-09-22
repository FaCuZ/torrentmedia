const Electron 		= require('electron'),
	  remote 		= Electron.remote,
	  ipcRenderer 	= Electron.ipcRenderer,
	  shell 		= Electron.shell,
	  dialog 		= remote.dialog,

	  Path 			= require('path'),
	  glob 			= require('glob'),
	  WebTorrent 	= require('webtorrent'),
	  Humanize 		= require('humanize-plus'),
	  XML 			= require('pixl-xml'),

	  gui 			= require('./js/gui'),
	  downloads		= require('./js/downloads'),
	  intervals		= require('./js/intervals'),
	  configs		= require('./js/configs'),
	  channels		= require('./js/channels')

var client		= new WebTorrent(),
	settings	= remote.getGlobal('settings'),  
	locale		= require('./json/locale/' + settings.locale + '.json'),
	humanTime	= require('humanize-duration').humanizer({ language: settings.locale, largest: 1, round: true }),
	table		= $('#table').DataTable(tableConfig()),
	footer		= $(".main-footer").html(gui.generalFoot())

intervals.start.all()

ipcRenderer.on('torrents', (event, json) => {	
	for (var torrent in json) {
		downloads.torrent.add(json[torrent].magnetURI) 
	}
})

var call = {
			////-- MAIN --////
		btn_nav_main 		 :()=> gui.changePage('downloads'),
		btn_nav_stats 		 :()=> gui.changePage('stats'),
		btn_nav_mediacast 	 :()=> gui.changePage('mediacast'),
		btn_nav_autofeeds 	 :()=> gui.changePage('autofeeds'),
		btn_search	 		 :()=> gui.searchTorrent(),
		btn_bottom_fullscreen:()=> gui.send('fullscreen'),
		btn_bottom_private	 :()=> gui.alpha(),
		btn_bottom_hide		 :()=> gui.send('hide'),
		btn_bottom_close	 :()=> gui.send('close'),
		btn_sidebar_toggle	 :()=> gui.sidebarToggle(),
			////-- DOWNLOAD --////
		btn_add_download 	 :()=> downloads.torrent.add($('#tb-add-file').val()),
		btn_remove			 :()=> downloads.torrent.remove(table.row('tr.selected')),
		btn_pause			 :()=> downloads.torrent.pause(table.row('tr.selected')),	
		btn_filer			 :()=> gui.alpha(),
		btn_add_modal		 :()=> downloads.gui.addModal(),
		btn_add_fileDialog	 :()=> downloads.gui.getDialogFile(), 
		btn_add_folderDialog :()=> downloads.gui.getDialogFolder(),
		btn_cast			 :()=> downloads.gui.cast(),
		btn_share			 :()=> downloads.gui.share(),
		btn_position_up 	 :()=> torrents[torrentSelected.infoHash].up(),
		btn_position_down	 :()=> torrents[torrentSelected.infoHash].down(),
			////-- CHANNELS --////
		btn_nav_channels 	 :()=> channels.gui.open(),
		btn_channels_alert	 :()=> channels.gui.closeAlert(),
		btn_channel			 :()=> gui.alpha(),
			////-- CONFIGS --////
		btn_configs_save 	 :()=> configs.gui.save(),
		box_general_lenguage :()=> configs.general.lenguage(),
		chk_general_close	 :()=> configs.general.close(),
		chk_general_minimize :()=> configs.general.minimize(),
		chk_general_hide	 :()=> configs.general.hide(),
		chk_general_delete	 :()=> configs.general.delete(),
		box_general_theme	 :()=> configs.general.theme(),
		btn_bottom_settings	 :()=> configs.gui.open()		

	}

$('#table tbody').on( 'click', 'tr', function () {
	torrentSelected = downloads.selectTr($(this))
})


function tableConfig(){
	let json = require('./json/datatable.json')

	for (var i = json.columns.length - 1; i >= 0; i--) {
		json.columns[i].title = locale.table[json.columns[i].title]
	}
	return json

}

var	torrents = {
	find: position => {
		for (var i in torrents) 
			if(torrents[i].position === position)
				return torrents[i]
	},
	
	persist: () => {
		ipcRenderer.send('torrents', torrents)
		return true
	},

	length: () => {
		let length = -3
		for (var i in torrents)	length++
		return length
	}
}

class Torrent { 
	constructor(torrent) {	
		//this.super = torrent
		this.magnetURI = torrent.magnetURI
		this.path = torrent.path
		this.paused = torrent.paused

		this._position = torrents.length()
		//this.progress = 50
	}
	
	get position() { return this._position }
	set position(value) { this._position = value }

	up() { 
		let nextTorrent = torrents.find(this._position+1)
		if(nextTorrent){
			this._position++
			nextTorrent._position--
		} else return null
	}
	down() {
		let prevTorrent = torrents.find(this._position-1)
		if(prevTorrent){
			this._position--
			prevTorrent._position++
		} else return null
	}

}
	

///////////////////
////** DEBUG **////
///////////////////
var tId0 = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'

$('#tb-add-file').val(tId0)

//downloads.torrent.add(tId0) 
////** END DEBUG **////