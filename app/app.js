const remote = require('remote'),
	  dialog = remote.require('dialog'),
	  WebTorrent = require('webtorrent'),
	  humanizeDuration = require('humanize-duration'),
	  Humanize = require('humanize-plus')

var client = new WebTorrent(),
	torrents = {},
	settings = {},
	i18n = {}

loadSettings()

console.log(settings.interval_refresh)

var esHumanTime = humanizeDuration.humanizer({ language: 'es', largest: 1, round: true })

var table = $('#table').DataTable({
	"paging": false,
	"lengthChange": true,
	"searching": false,
	"ordering": true,
	"info": true,
	"autoWidth": true,
	"bInfo": false,
	"columns": [
		{ title: "#",  "className": "column-id"},
		{ title: "Nombre", "className": "column-name" },
		{ title: "Tamaño" },
		{ title: "Progreso" },
		{ title: "Descarga" },
		{ title: "Subida" },
		{ title: "Peers" },
		{ title: "Ratio" },
		{ title: "Estimado" }
	]
})

$(".main-footer").html(generalFoot())

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

$('body').on('click', function (event){
	let target = event.target.id
	if(!target) target = event.target.parentNode.id

	switch(target) {
		///- BUTTON: ADD TORRENT: FILE DIALOG -///
		case 'btn-agregar-fileDialog': 
			filtros = { filters: [{ name: 'Torrents', extensions: ['torrent'] } ], properties: ['openFile'] }
			dialog.showOpenDialog(filtros, function (fileName) {
				$('#tb-agregar-file').val(fileName)
			})		
			break

		///- BUTTON: ADD TORRENT: FOLDER DIALOG -///
		case 'btn-agregar-folderDialog':
			filtros = { properties: ['openDirectory'] }			
			dialog.showOpenDialog(filtros, function (folderName) {
				$('#tb-agregar-folder').val(folderName)
			})		
			break

		///- BUTTON: ADD TORRENT: DOWNLOAD -///
		case 'btn-agregar-download': 
			addTorrent($('#tb-agregar-file').val())			
			break

		///- BUTTON: REMOVE TORRENT -///
		case 'btn-remove': 
			removeTorrent(table.row('tr.selected'))			
			break

		///- BUTTON: REMOVE TORRENT -///
		case 'btn-pause': 
			pauseTorrent(table.row('tr.selected'))			
			break
		
		///- BUTTON: POSITION UP -///
		case 'btn-position-up': 
			torrents[torrentSelected.infoHash].up()
			break
		
		///- BUTTON: POSITION DOWN -///
		case 'btn-position-down': 
			torrents[torrentSelected.infoHash].down()
			break
		
		///- NAV BUTTON: STATS -///
		case 'btn-main': 
			$('.content-wrapper').hide()
			$('.content-wrapper-main').show()
			break

		///- NAV BUTTON: STATS -///
		case 'btn-stats': 
			$('.content-wrapper').hide()
			$('.content-wrapper-stats').show()
			break

		///- NAV BUTTON: AUTOFEEDS -///
		case 'btn-autofeeds': 
			$('.content-wrapper').hide()
			$('.content-wrapper-autofeeds').show()
			break

		///- NAV BUTTON: CHANNELS -///
		case 'btn-channels': 
			$('.content-wrapper').hide()
			$('.content-wrapper-channels').show()
			break

		default:
			break
	}

})

function loadSettings(){
	settings['interval_refresh'] = 500
	settings['conections_max'] = 25
	settings['base_lang'] = 'es'
	console.log(settings)	
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
	
	let torrent = client.add(torrentID, function (torrent) {
	})


	torrent.on('infoHash', function (error) {
		$(temp.node()).attr('data-hash', torrent.infoHash)
		if(!torrents[torrent.infoHash]) torrents[torrent.infoHash] = new Torrent()
	})


	torrent.on('error', function (error) {
		temp.row().remove().draw()
		alert(error)
	})

	/*torrent.on('done', function () {
		changeStyleProgress($(temp.node()).find('.progress-bar'), 'success', false)
	})*/

}

function removeTorrent(row){
	// TODO: Preguntar si esta seguro, y si quiere borrar los archivos tambien
	torrentSelected.destroy(function(){
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


var interval = setInterval(function () {
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

function fixRatio(ratio){
	if(ratio > 1000) return "&infin;"
	return Humanize.formatNumber(ratio, 2)	
}

function progressBar(progress, element, torrent = null){ //progress-bar-info progress-bar-striped

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
	let ds = Humanize.fileSize(client.downloadSpeed) + "/s"
	let us = Humanize.fileSize(client.uploadSpeed) + "/s"
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


/*** DEBUG ***/
var torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'
var torrentId1 = "magnet:?xt=urn:btih:DF19459B13F9E6B57347DBEE54F2DBBD751B914A&dn=10+cloverfield+lane+2016+1080p+hdrip+x264+aac+jyk&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
var torrentId2 = "/home/facuz/Descargas/sintel.torrent"

$('#tb-agregar-file').val(torrentId)

addTorrent(torrentId)
addTorrent(torrentId1)
/*** END DEBUG ***/
