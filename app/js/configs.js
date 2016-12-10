module.exports = {	

	general: {
		lenguage (){ temp['locale'] = event.target.value },		
		close 	 (){ temp['exit_without_ask'] = event.target.checked },
		minimize (){ temp['exit_forced'] = event.target.checked },
		hide 	 (){ temp['start_hide'] = event.target.checked },
		delete 	 (){ temp['ask_on_delete'] = event.target.checked },
		theme 	 (){ temp['theme'] = event.target.value }
	},

	network: {
		conections (){ temp['conections_max'] = event.target.value },		
		directory  (){ temp['dir_downloads'] = event.target.value },
		announces  (){ temp['announces'] = event.target.value }
	},
	
	advance: {
		table 	(){ temp_interval['table'] = event.target.value },		
		tray 	(){ temp_interval['tray'] = event.target.value },		
		footer	(){ temp_interval['footer'] = event.target.value },		

		reset() { 
			dialog.showMessageBox({
				type: "question",
				title: locale.dialog.reset.title,
				message: locale.dialog.reset.ask,
				defaultId: 0,
				cancelId: 0, 
				buttons: [locale.cancel, locale.dialog.reset.accept]
			}, select => {
				if(select === 0) return false

				gui.send('reset-settings')

				$('#modal_configs').modal('hide')
			})

		}
	},

	gui: {
		open() {
			temp = []
			temp_interval = []
			modal = $('#modal_configs')

			modal.modal('toggle')

			configs.gui.set(modal);
		}, 
	
		save() {
			for (config in temp) settings[config] = temp[config] 
			
			for (config in temp_interval) settings.interval[config] = temp_interval[config]
			
			ipcRenderer.send('save-settings', settings)
		},		

		set(modal) {
			let checkboxs = ['exit_without_ask', 'start_hide', 'exit_forced', 'ask_on_delete']

			for (var i = checkboxs.length - 1; i >= 0; i--) {
				modal.find('#opt-'+checkboxs[i]).prop("checked", settings[checkboxs[i]])
			}
			
			let textboxs = ['announces', 'conections_max', 'dir_downloads']
			for (var i = textboxs.length - 1; i >= 0; i--) {
				modal.find('#opt-'+textboxs[i]).val(settings[textboxs[i]])
			}
			
			let intervals = ["table", "tray", "footer"]
			for (var i = intervals.length - 1; i >= 0; i--) {
				modal.find('#opt-interval_'+intervals[i]).val(settings.interval[intervals[i]])
			}

			modal.find('#opt-locale-'+ settings.locale).prop("selected", true)
		} 

	}

}