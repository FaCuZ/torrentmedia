var remote = require('remote')
var dialog = remote.require('dialog')

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
			{ title: "Vel Descarga" },
			{ title: "Vel Subida" },
			{ title: "Seeds/Peers" },
			{ title: "Tiempo Est." }
		]
})

$('#table tbody').on( 'click', 'tr', function () {
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
	switch(event.target.id) {
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
		'-'
	]).draw()
	
	torrent = client.add(torrentID, function (torrent) {
		//alert("dentro")
	})

	torrent.on('error', function (error) {
		temp.row().remove()
		alert(error)
	})

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
				(torrent.progress * 100).toFixed(1) + '%',
				Humanize.fileSize(torrent.downloadSpeed) + "/s",
				Humanize.fileSize(torrent.uploadSpeed) + "/s",
				torrent.numPeers,
				esHumanTime(torrent.timeRemaining)
			]).draw()
		}
	}

}, 500)



/*** DEBUG ***/
var torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'
var torrentId1 = "magnet:?xt=urn:btih:DF19459B13F9E6B57347DBEE54F2DBBD751B914A&dn=10+cloverfield+lane+2016+1080p+hdrip+x264+aac+jyk&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
var torrentId2 = "/home/facuz/Descargas/sintel.torrent"

$('#tb-agregar-file').val(torrentId)

//addTorrent(torrentId)
//addTorrent(torrentId1)
/*** END DEBUG ***/
