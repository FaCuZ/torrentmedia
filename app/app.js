//var WebTorrent = require('webtorrent')

var client = new WebTorrent()

// Obtiene el magnet
var torrentId = 'magnet:?xt=urn:btih:6a9759bffd5c0af65319979fb7832189f4f3c35d&dn=sintel.mp4&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&tr=wss%3A%2F%2Ftracker.webtorrent.io&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel-1024-surround.mp4'


/*
Start downloading a new torrent.
Inicia la descarga de un nuevo torrent

torrentId puede ser:
	- magnet uri (string)
	- torrent file (buffer)
	- info hash (hex string or buffer)
	- parsed torrent (from parse-torrent)
	- http/https url to a torrent file (string)
	- filesystem path to a torrent file (string)

If opts is specified, then the default options (shown below) will be overridden.
{
  announce: [],              // Torrent trackers to use (added to list in .torrent or magnet uri)
  getAnnounceOpts: Function, // Custom callback to allow sending extra parameters to the tracker
  maxWebConns: Number,       // Max number of simultaneous connections per web seed [default=4]
  path: String,              // Folder to download files to (default=`/tmp/webtorrent/`)
  store: Function            // Custom chunk store (must follow [abstract-chunk-store](https://www.npmjs.com/package/abstract-chunk-store) API)
}*/
client.add(torrentId, function (torrent) {
	// Torrents can contain many files. Let's use the first.
	var file = torrent.files[0]

	document.getElementById("nombre").innerHTML = torrent.name

	setTimeout(function () {
			document.getElementById("tiempo").innerHTML = torrent.timeRemaining			
		}, 1000)

	var interval = setInterval(function () {
		document.getElementById("tiempo").innerHTML = (torrent.progress * 100).toFixed(1) + '%'		
//	  log('Progress: ' + (torrent.progress * 100).toFixed(1) + '%')
	}, 1000)

	console.log(torrent);

  // Display the file by adding it to the DOM.
  // Supports video, audio, image files, and more!
  //file.appendTo('body')
})