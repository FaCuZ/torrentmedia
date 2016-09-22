module.exports = {
	torrentSelected: null, // VER SI SE ROMPIO ALGO AL COMENTAR ESTA LINEA

	selectTr: elem => {
		if($('#table tbody td').hasClass('dataTables_empty')) return false 

		if (elem.hasClass('selected')) { 
			elem.removeClass('selected')
			$('#btns-hided').hide()
			torrentSelected = null
		} else {
			table.$('tr.selected').removeClass('selected')
			elem.addClass('selected')
			$('#btns-hided').show()
			torrentSelected = client.get(elem.data("hash")) 
		}

		return torrentSelected
	},

	torrent: {
		// TODO: Agregar mas parametros a add para cuando el torrent viene de la persistencia (Nombre, progreso, estado)

		add: torrentID => {
			let temp = table.row.add([
				' ',
				locale.loading,
				'0 Kb/s',
				gui.progressBar(0, $('#table')),
				'0 Kb/s',
				'0 Kb/s',
				'0',
				'0',
				'-'
			]).draw()
			
			let torrent = client.add(torrentID,	{ path: $('#tb-add-folder').val() }, torrent => { 
					torrents.persist()
				})

			torrent.on('infoHash', error => {
				$(temp.node()).attr('data-hash', torrent.infoHash)
				if(!torrents[torrent.infoHash]) torrents[torrent.infoHash] = new Torrent(torrent)
			})

			torrent.on('error', error => {
				temp.row().remove().draw()
				gui.setTray(false, 'red')
				alert(error)
				//TODO: cambiar el alert por:
				//dialog.showErrorBox(title, content)
			})

			torrent.on('done', () => gui.setTray(true, 'green'))


		},

		remove: row => {
			
			let destroy = () => {
				torrentSelected.destroy( () => {
					delete torrents[torrentSelected.infoHash]
					row.remove().draw()
					$('#btns-hided').hide()

					//if(client.torrents.length === 0) 

					torrents.persist()
				})
			}
			
			if(!settings.ask_on_delete) {
				destroy()
				return true
			}

			dialog.showMessageBox({
				type: "question",
				title: locale.dialog.delete.torrent,
				message: locale.dialog.delete.ask,
				defaultId: 0,
				cancelId: 0, 
				buttons: [locale.cancel, locale.dialog.delete.files, locale.remove]
			}, select =>{
				if(select === 0) return false
				
				destroy()	  
				
				//if(select === 1) TODO: borrar archivos
			})
			

		},

		pause: row => {
			$('#btn-pause i').toggleClass('fa-pause').toggleClass('fa-play')

			/* TODO: 
			Eliminar Torrent:
			torrentSelected.destroy()
			
			Cuando se despausa buscar en hash dentro de torrents[]
			La funciona anterior no borra este array el torrent
			*/

			// NOTE: Pausa pero no funciona
			console.log(torrentSelected.paused)
			if(torrentSelected.paused) torrentSelected.resume()
			else torrentSelected.pause()
			console.log(torrentSelected.paused)

			torrents.persist()
		},

	},

	gui: {
		addModal: ()=> {
			$('#addModal').modal('toggle')
			$('#tb-add-folder').val(settings.dir_downloads)
		},

		cast: ()=> {
			gui.alpha()
		},

		share: ()=> {
			gui.alpha()
		},

		getDialogFile: ()=> {
			let config = {	title: locale.dialog.torrent,
							filters: [{ name: 'Torrents', extensions: ['torrent'] }],
							defaultPath: settings.dir_downloads,
							properties: ['openFile']
						 }

			dialog.showOpenDialog(config, name => $('#tb-add-file').val(name))	
		},

		getDialogFolder: ()=> {
			let config = {  title: locale.dialog.folder,
							defaultPath: settings.dir_downloads,
							properties: ['openDirectory', 'createDirectory']
						 }		

			dialog.showOpenDialog(config, name => $('#tb-add-folder').val(name))	
		},


	},

}




