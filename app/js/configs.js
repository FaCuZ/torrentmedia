module.exports = {	

	general: {
		lenguage: 	()=> { temp['locale'] = event.target.value },		
		close: 		()=> { temp['exit_without_ask'] = !event.target.checked },
		minimize: 	()=> { temp['exit_forced'] = event.target.checked },
		hide: 		()=> { temp['start_hide'] = event.target.checked },
		delete: 	()=> { temp['ask_on_delete'] = event.target.checked },
		theme: 		()=> { temp['theme'] = event.target.value }
	},
	
	advance: {
		reset: ()=> { 

			dialog.showMessageBox({
				type: "question",
				title: locale.dialog.reset.title,
				message: locale.dialog.reset.ask,
				defaultId: 0,
				cancelId: 0, 
				buttons: [locale.cancel, locale.dialog.reset.accept]
			}, select =>{
				if(select === 0) return false

				ipcRenderer.send('reset-settings') 

				$('#modal_configs').modal('hide')
			})

		}
	},

	gui: {
		open: ()=> {
			temp = []
			$('#modal_configs').modal('toggle')
		},
	
		save: ()=> {
			for (config in temp) {
				settings[config] = temp[config]
			}
			
			ipcRenderer.send('save-settings', settings)
		},

	}

}