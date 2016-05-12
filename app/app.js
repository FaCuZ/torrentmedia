const remote = require('remote')
const dialog = remote.require('dialog')
var WebTorrent = require('webtorrent')
var humanizeDuration = require('humanize-duration')
var Humanize = require('humanize-plus')

var client = new WebTorrent()

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
			{ title: "#" },
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
	} else {
		table.$('tr.selected').removeClass('selected')
		$(this).addClass('selected')
		$('#btns-hided').show()
	}
})

$('body').on('click', function (event){
	target = event.target.id
	if(!target) target = event.target.parentNode.id

	switch(target) {
		case 'btn-agregar-fileDialog': ///- BUTTON: ADD TORRENT: FILE DIALOG -///
			filtros = { filters: [{ name: 'Torrents', extensions: ['torrent'] } ], properties: ['openFile'] }
			dialog.showOpenDialog(filtros, function (fileName) {
				$('#tb-agregar-file').val(fileName)
			})		
			break

		case 'btn-agregar-folderDialog': ///- BUTTON: ADD TORRENT: FOLDER DIALOG -///
			filtros = { properties: ['openDirectory'] }			
			dialog.showOpenDialog(filtros, function (folderName) {
				$('#tb-agregar-folder').val(folderName)
			})		
			break

		case 'btn-agregar-download': ///- BUTTON: ADD TORRENT: DOWNLOAD -///
			addTorrent($('#tb-agregar-file').val())			
			break

		case 'btn-remove': ///- BUTTON: REMOVE TORRENT -///
			removeTorrent(table.row('tr.selected'))			
			break

		case 'btn-pause': ///- BUTTON: REMOVE TORRENT -///
			pauseTorrent(table.row('tr.selected'))			
			break

		default:
			break
	}

})

function addTorrent(torrentID){
	temp = table.row.add([
		'#',
		'Cargando...',
		'0 Kb/s',
		'0%',
		'0 Kb/s',
		'0 Kb/s',
		'0',
		'0',
		'-'
	]).draw()
	
	torrent = client.add(torrentID, function (torrent) {
		//alert("dentro")
	})

	torrent.on('error', function (error) {
		temp.row().remove().draw()
		alert(error)
	})

	torrent.on('done', function () {
		//temp.row().remove().draw()
	})

}

function removeTorrent(row){
	// NOTE: Cuando hago lo de las posiciones tengo que cambiar row data 0 
	var torrent = client.torrents[row.data()[0]]

	// TODO: Preguntar si esta seguro, y si quiere borrar los archivos tambien
	torrent.destroy(function(){
		row.remove().draw()
		$('#btns-hided').hide()
		//if(client.torrents.length === 0) 
	})

}

function pauseTorrent(row){
	$('#btn-pause i').toggleClass('fa-pause').toggleClass('fa-play') 

	// NOTE: Pausa pero no funciona
	var torrent = client.torrents[row.data()[0]]

	console.log(torrent.paused)
	console.log(torrent.pause())
	console.log(torrent.paused)
}


var interval = setInterval(function () {
	let count = client.torrents.length 
	if(count > 0){
		for (var i = count - 1; i >= 0; i--) {
			torrent = client.torrents[i]
			table.row(i).data([
				i,
				torrent.name,
				Humanize.fileSize(torrent.downloaded),
				progressBar((torrent.progress * 100).toFixed(1), $('#table')),
				Humanize.fileSize(torrent.downloadSpeed) + "/s",
				Humanize.fileSize(torrent.uploadSpeed) + "/s",
				torrent.numPeers,
				fixRatio(torrent.ratio),
				esHumanTime(torrent.timeRemaining)
			]).draw()
		}

	$(".main-footer").html(generalFoot())

	}

}, 500)

function fixRatio(ratio){
	if(ratio > 1000) return "&infin;"
	return Humanize.formatNumber(ratio, 2)	
}

function progressBar(progress, elem){
	var size = elem.find('.progress').outerWidth()
	return `<div class="progress">
				<span class="p-black" style="width: ${size}px;">${progress}%</span>
				<div class="progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${progress}%;">
					<span class="p-white" style="width: ${size}px;">${progress}%</span>
				</div>
			</div>
			`
}


function generalFoot (){
	
	var pb = progressBar((client.progress * 100).toFixed(1), $('.main-footer'))
	var ds = Humanize.fileSize(client.downloadSpeed) + "/s"
	var us = Humanize.fileSize(client.uploadSpeed) + "/s"
	var ra = fixRatio(client.ratio)
	var o = ""
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

//addTorrent(torrentId)
//addTorrent(torrentId1)
/*** END DEBUG ***/
