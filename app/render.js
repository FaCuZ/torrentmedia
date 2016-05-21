const remote = require('remote'),
	  dialog = remote.require('dialog'),
	  app = remote.require('app'),	  
	  Path = require('path'),
	  ipcRenderer = require('electron').ipcRenderer,
	  fs = require('fs'),
	  WebTorrent = require('webtorrent'),
	  humanizeDuration = require('humanize-duration'),
	  Humanize = require('humanize-plus')

var client = new WebTorrent(),
	esHumanTime = humanizeDuration.humanizer({ language: 'es', largest: 1, round: true }),
	datatableJSON = require('../json/datatable.json')
	configPath = app.getPath('userData'),
	settings = loadSettings(),
	torrents = {},
	i18n = {}

table = $('#table').DataTable(datatableJSON)

$(".main-footer").html(generalFoot())


////////////////////
////-- EVENTS --////
////////////////////
$('#table tbody').on( 'click', 'tr', function () {
	if($('#table tbody td').hasClass('dataTables_empty')) return false 

	if ($(this).hasClass('selected')) { 
		$(this).removeClass('selected')
		$('#btns-hided').hide()
		torrentSelected = null
	} else {
		table.$('tr.selected').removeClass('selected')
		$(this).addClass('selected')
		torrentSelected = client.get($(this).data("hash")) 
		$('#btns-hided').show()
	}
})

var call = {
		btn_add_download: () => addTorrent($('#tb-agregar-file').val()),
		btn_remove: () => removeTorrent(table.row('tr.selected')),
		btn_pause: () => pauseTorrent(table.row('tr.selected')),	
		btn_position_up: () => torrents[torrentSelected.infoHash].up(),
		btn_position_down: () => torrents[torrentSelected.infoHash].down(),
		btn_add_fileDialog: () => {
			filtros = { title: 'Please select a torrent',
						filters: [{ name: 'Torrents', extensions: ['torrent'] }],
						defaultPath: app.getPath('downloads'),
						properties: ['openFile']
					  }
			dialog.showOpenDialog(filtros, function (fileName) {
				$('#tb-agregar-file').val(fileName)
			})		
		}, 
		btn_add_folderDialog: () => {
			filtros = { title: 'Please select a folder',
						defaultPath: app.getPath('downloads'),
						properties: ['openDirectory', 'createDirectory']
					  }			
			dialog.showOpenDialog(filtros, function (folderName) {
				$('#tb-agregar-folder').val(folderName)
			})		
		},
		btn_nav_main: () => {
			$('.content-wrapper').hide()
			$('.content-wrapper-main').show()
		},
		btn_nav_stats: () => {
			$('.content-wrapper').hide()
			$('.content-wrapper-stats').show()
		},
		btn_nav_autofeeds: () => {
			$('.content-wrapper').hide()
			$('.content-wrapper-autofeeds').show()
		},
		btn_nav_channels: () => {
			$('.content-wrapper').hide()
			$('.content-wrapper-channels').show()
		}
}


///////////////////////
////-- FUNCTIONS --////
///////////////////////
function loadSettings(){
	try	{
		let path = configPath + '/settings.json'
		fs.openSync(path, 'r+')
		return JSON.parse(fs.readFileSync(path, 'utf8'))
	} catch (error) {
		return require('../json/settings.default.json')
	}

}

function addTorrent(torrentID){
	let temp = table.row.add([
		'#',
		'Cargando...',
		'0 Kb/s',
		progressBar(0, $('#table')),
		'0 Kb/s',
		'0 Kb/s',
		'0',
		'0',
		'-'
	]).draw()
	
	let torrent = client.add(torrentID, torrent => {  })

	torrent.on('infoHash', error => {
		$(temp.node()).attr('data-hash', torrent.infoHash)
		if(!torrents[torrent.infoHash]) torrents[torrent.infoHash] = new Torrent()
	})

	torrent.on('error', error => {
		temp.row().remove().draw()
		setTray(false, 'red')
		alert(error)
	})

	torrent.on('done', () => { setTray(true, 'green') })

}

function setTray(blink, color){
	settings['tray_blink'] = blink
	settings['tray_color'] = color
}

function removeTorrent(row){
	// TODO: Preguntar si esta seguro, y si quiere borrar los archivos tambien
	torrentSelected.destroy( () => {
		row.remove().draw()
		$('#btns-hided').hide()
		//if(client.torrents.length === 0) 
	})

}

function pauseTorrent(row){
	$('#btn-pause i').toggleClass('fa-pause').toggleClass('fa-play') 

	// NOTE: Pausa pero no funciona
	console.log(torrentSelected.paused)
	if(torrentSelected.paused) torrentSelected.resume()
	else torrentSelected.pause()
	console.log(torrentSelected.paused)
}

function fixRatio(ratio){
	if(ratio > 1000) return "&infin;"
	return Humanize.formatNumber(ratio, 2)	
}

function progressBar(progress, element, torrent = null){ 

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
}

function generalFoot (){	
	let pb = progressBar((client.progress * 100).toFixed(1), $('.main-footer'))
	let ds = Humanize.fileSize(client.downloadSpeed) + '/s'
	let us = Humanize.fileSize(client.uploadSpeed) + '/s'
	let ra = fixRatio(client.ratio)
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
}


///////////////////////
////-- INTERVALS --////
///////////////////////
var interval = setInterval( () => {
	let count = client.torrents.length 
	if(count > 0){
		for (var i = count - 1; i >= 0; i--) {
			torrent = client.torrents[i]
			table.row(i).data([
				torrents[torrent.infoHash].position,//i,
				torrent.name,
				Humanize.fileSize(torrent.downloaded),
				progressBar((torrent.progress * 100).toFixed(1), $('#table'), torrent),
				Humanize.fileSize(torrent.downloadSpeed) + "/s",
				Humanize.fileSize(torrent.uploadSpeed) + "/s",
				torrent.numPeers,
				fixRatio(torrent.ratio),
				esHumanTime(torrent.timeRemaining)
			]).draw()
		}

	$(".main-footer").html(generalFoot())

	}

}, settings.interval_refresh)

var intervalTray = setInterval( () => {
	let ds = Humanize.fileSize(client.downloadSpeed) + '/s'
	let us = Humanize.fileSize(client.uploadSpeed) + '/s'

	ipcRenderer.send('tray', ' ↓ ' + ds + ' ↑ ' + us, settings.tray_blink, settings.tray_color)

}, settings.interval_tray)


/////////////////////
////-- CLASSES --////
/////////////////////
class Torrent { 
	constructor() {	
		this._position = '99'
		this.progress = '50'
	}
	
	get position() { return this._position }
	set position(value) { this._position = value }

	up() { this._position++ }
	down() { this._position-- }

}


///////////////////
////** DEBUG **////
///////////////////
var tId0 = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'
var tId1 = "magnet:?xt=urn:btih:DF19459B13F9E6B57347DBEE54F2DBBD751B914A&dn=10+cloverfield+lane+2016+1080p+hdrip+x264+aac+jyk&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
var tId2 = "/home/facuz/Descargas/sintel.torrent"

$('#tb-agregar-file').val(tId0)

addTorrent(tId0)
addTorrent(tId1)
////** END DEBUG **////