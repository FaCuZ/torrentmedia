module.exports = {	

	general: {
		lenguage (){ temp['locale'] = event.target.value },		
		close 	 (){ temp['exit_without_ask'] = event.target.checked },
		minimize (){ temp['exit_forced'] = event.target.checked },
		hide 	 (){ temp['start_hide'] = event.target.checked },
		delete 	 (){ temp['ask_on_delete'] = event.target.checked },
		theme 	 (){ temp['theme'] = event.target.value }
	},
	
	advance: {
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

				ipcRenderer.send('reset-settings') 

				$('#modal_configs').modal('hide')
			})

		}
	},

	gui: {
		open() {
			temp = []
			modal = $('#modal_configs')

			modal.modal('toggle')

			configs.gui.set(modal);
		},
	
		save() {
			console.log(temp)
			for (config in temp) {
				settings[config] = temp[config]
			}
			
			ipcRenderer.send('save-settings', settings)
		},		

		set(modal) {

			let checkboxs = ['exit_without_ask', 'start_hide', 'exit_forced', 'ask_on_delete']
			for (var i = checkboxs.length - 1; i >= 0; i--) {
				modal.find('#opt-'+checkboxs[i]).prop("checked", settings[checkboxs[i]])
			}

			let intervals = ["table", "tray", "footer"]
			for (var i = intervals.length - 1; i >= 0; i--) {
				modal.find('#opt-interval_'+intervals[i]).val(settings.interval[intervals[i]])
			}

			modal.find('#opt-locale-'+ settings.locale).prop("selected", true)
		} 

	}

}