var client = new WebTorrent()

var esHumanTime = humanizeDuration.humanizer({
	language: 'es',
	largest: 1,
	round: true
})

var torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'

client.add(torrentId, function (torrent) {
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
	]).draw(false);

	/*$('#nombre').html(torrent.name)

	var interval = setInterval(function () {
		$("#tiempo").html((torrent.progress * 100).toFixed(1) + '%')		
	}, 1000)

	console.log(torrent);
*/


//	torrent.on('download', function (chunkSize) {
		//currentCalls = t.rows().data();

        var interval = setInterval(function () {
			
			tabla.row(0).data([
				'1',
				torrent.name,
				Humanize.fileSize(torrent.downloaded),
				(torrent.progress * 100).toFixed(1) + '%',
				Humanize.fileSize(torrent.downloadSpeed) + " / " + Humanize.fileSize(torrent.uploadSpeed),
				torrent.numPeers,
				esHumanTime(torrent.timeRemaining)
			]).draw();

        }, 500)



//	})
	
})