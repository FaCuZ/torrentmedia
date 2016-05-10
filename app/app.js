var WebTorrent = require('webtorrent')
var humanizeDuration = require('humanize-duration')
var Humanize = require('humanize-plus')
var remote = require('remote'); 
var dialog = remote.require('dialog'); 

var client = new WebTorrent()

var esHumanTime = humanizeDuration.humanizer({
	language: 'es',
	largest: 1,
	round: true
})
var torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'
var torrentId = "magnet:?xt=urn:btih:DF19459B13F9E6B57347DBEE54F2DBBD751B914A&dn=10+cloverfield+lane+2016+1080p+hdrip+x264+aac+jyk&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce"
var torrentId = "/home/facuz/Descargas/sintel.torrent"
$('#tb-agregar-file').val(torrentId) // PARA TESTEO NADA MAS


/*** Agregar Torrent Dialog ***/
$('#btn-agregar-fileDialog').click(function (){
	let filtros = { filters: [{ name: 'Torrents', extensions: ['torrent'] } ],
					properties: ['openFile'] }

	dialog.showOpenDialog(filtros, function (fileName) {
		$('#tb-agregar-file').val(fileName)
		// if (fileNames === undefined) return;
		// var fileName = fileNames[0];
		// $('#tb-agregar-file').val(fileName)

		// fs.readFile(fileName, 'utf-8', function (err, data) {
		// 	document.getElementById("editor").value = data;*/
		// });
	})

	
	// dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory']})
	
	// dialog.setContext(document) 
	// dialog.openFileDialog('.torrent', '/', function(result) {
	//     $('#tb-agregar-file').val(result)
	// })
})

$('#btn-agregar-folderDialog').click(function (){
	let filtros = { properties: ['openDirectory'] }
	
	dialog.showOpenDialog(filtros, function (folderName) {
		$('#tb-agregar-folder').val(folderName)
	})

})

$('#btn-agregar-download').click(function (){

	console.log($('#tb-agregar-file').val());

	client.add($('#tb-agregar-file').val(), function (torrent) {
		console.log(torrent);
		//var file = torrent.files[0]
		//console.log(tabla);
		
		var fila = tabla.row.add([
			'1',
			torrent.name,
			Humanize.fileSize(torrent.downloaded),
			(torrent.progress * 100).toFixed(1) + '%',
			Humanize.fileSize(torrent.downloadSpeed) + " / " + Humanize.fileSize(torrent.uploadSpeed),
			torrent.numPeers,
			esHumanTime(torrent.timeRemaining)
		]).draw(false)

		torrent.on('error', function (err) {
			console.log("salto un error")
		})

		var interval = setInterval(function () {
			
			tabla.row(0).data([
				'1',
				torrent.name,
				Humanize.fileSize(torrent.downloaded),
				(torrent.progress * 100).toFixed(1) + '%',
				Humanize.fileSize(torrent.downloadSpeed) + "/s | " + Humanize.fileSize(torrent.uploadSpeed) + "/s",
				torrent.numPeers,
				esHumanTime(torrent.timeRemaining)
			]).draw()

		}, 500)
		
	})


	//return e.preventDefault()

})
