module.exports = {
	table: null,
	tray: null,
	updateTable: () => {
		let count = client.torrents.length
		
		if(count <= 0) return null

		for (var i = count - 1; i >= 0; i--) {
			torrent = client.torrents[i]
			table.row(i).data([
				torrents[torrent.infoHash].position,
				torrent.name,
				Humanize.fileSize(torrent.downloaded),
				progressBar((torrent.progress * 100).toFixed(1), $('#table'), torrent),
				Humanize.fileSize(torrent.downloadSpeed) + "/s",
				Humanize.fileSize(torrent.uploadSpeed) + "/s",
				torrent.numPeers,
				fixRatio(torrent.ratio),
				humanTime(torrent.timeRemaining)
			]).draw()
		}

		$(".main-footer").html(generalFoot())
	},

	updateTray: () => {
		let ds = Humanize.fileSize(client.downloadSpeed) + '/s'
		let us = Humanize.fileSize(client.uploadSpeed) + '/s'

		ipcRenderer.send('tray', ' ↓ ' + ds + ' ↑ ' + us, settings.tray_blink, settings.tray_color)
	},

	stop: {	
		table:() => clearInterval(intervals.table),
		tray: () => clearInterval(intervals.tray),
		all:  () => {
			intervals.stop.table()
			intervals.stop.tray()
		}
	},

	start: {
		table:() => intervals.table = setInterval(() => intervals.updateTable(), settings.interval_refresh),
		tray: () => intervals.tray = setInterval(() => intervals.updateTray(), settings.interval_tray),
		all:  () => {
			intervals.start.table()
			intervals.start.tray()
		}

	}


}