module.exports = {
	table: null,
	tray: null,
	footer: null,
	
	stop: {	
		table: 	() => clearInterval(intervals.table),
		tray: 	() => clearInterval(intervals.tray),
		footer: () => clearInterval(intervals.footer),
		all:  	() => {
			intervals.stop.table()
			intervals.stop.tray()
			intervals.stop.footer()
		}, 
		window: () => {
			intervals.stop.table()
			intervals.stop.footer()
		}
	},

	start: {
		table: 	() => intervals.table  = setInterval(() => intervals.update.table(), settings.interval.table),
		tray: 	() => intervals.tray   = setInterval(() => intervals.update.tray(),  settings.interval.tray),
		footer: () => intervals.footer = setInterval(() => intervals.update.footer(),settings.interval.footer),
		all:  	() => {
			intervals.start.table()
			intervals.start.tray()
			intervals.start.footer()
		}, 
		window: () => {
			intervals.start.table()
			intervals.start.footer()
		}

	},

	update: {
		table: () => {
			let count = client.torrents.length
			
			if(count <= 0) return null

			for (var i = count - 1; i >= 0; i--) {
				torrent = client.torrents[i]
				table.row(i).data([
					torrents[torrent.infoHash].position,
					torrent.name,
					Humanize.fileSize(torrent.downloaded),
					gui.progress.table(torrent),
					Humanize.fileSize(torrent.downloadSpeed) + "/s",
					Humanize.fileSize(torrent.uploadSpeed) + "/s",
					torrent.numPeers,
					gui.fixRatio(torrent.ratio),
					humanTime(torrent.timeRemaining)
				]).draw()
			}
		},

		footer: () => {
			$(".main-footer").html(gui.generalFoot())
		},

		tray: () => {
			let ds = Humanize.fileSize(client.downloadSpeed) + '/s'
			let us = Humanize.fileSize(client.uploadSpeed) + '/s'

			ipcRenderer.send('tray', ' ↓ ' + ds + ' ↑ ' + us, settings.tray_blink, settings.tray_color)
		}
	}

}