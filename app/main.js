'use strict'

const Electron = require('electron'),
	  Path = require('path'),
	  fs = require('fs'),
	  storage = require('electron-storage'),
	  dialog = Electron.dialog,
	  app = Electron.app,
	  ipcMain = Electron.ipcMain,
	  Menu = Electron.Menu,
	  MenuItem = Electron.MenuItem,
	  Tray = Electron.Tray,
	  BrowserWindow = Electron.BrowserWindow

var mainWindow = null,
	force_quit = false,
	appIcon = null,
	flag = true

var	boot = {
	settings: {
		load() {
			let path = app.getPath('userData') + '/App/Settings.json'

			try	{
				fs.openSync(path, 'r+')
				return JSON.parse(fs.readFileSync(path, 'utf8'))
			} catch (error) {
				return boot.settings.install()
			}
		},

		install() {
			let def = require('./json/settings.default.json')

			console.log('Default settings')

			def.dir_downloads = app.getPath('downloads')
			//osLocale((err, locale) => def.locale = locale)

			boot.settings.save(def)

			return def
		},

		save(def) {
			storage.set('App/Settings', def, (err) => {
				if (err) console.error(err)
			})
		}
	},

	torrents: {
		load() {
			storage.get('App/Torrents', (err, json) => {
				if (err) json = [] 

				mainWindow.webContents.send('torrents', json)
			})
		}
	}

}

global.settings = boot.settings.load()


app.on('window-all-closed', () => {
	if(process.platform != 'darwin'){
		app.quit()
	}
})

if(app.makeSingleInstance((commandLine, workingDirectory) => {
	if (mainWindow) {
		if(mainWindow.isMinimized()) mainWindow.restore()
		if(!mainWindow.isVisible())  mainWindow.show()
		mainWindow.focus()
	}
})){
	return app.quit()
}

app.on('activate-with-no-open-windows', () => mainWindow.show())

app.on('ready', () => {
	console.log("Electron: " + process.versions.electron)
	console.log("Chrome: " + process.versions.chrome)

	mainWindow = new BrowserWindow ({
									 width: 1200,
									 height: 800,
									 autoHideMenuBar: true,
									 show: !settings.start_hide,
									 title: "TorrentMedia",
									 icon: getIconPath('white')
									})

	if(!settings.start_hide) {
		if(settings.start_maximized) mainWindow.maximize()
		else if(settings.start_minimized) mainWindow.minimize()
	}

	mainWindow.loadURL('file://' + __dirname + '/index-' + settings.locale + '.html')

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	mainWindow.on('close', event => {
		if(settings.exit_forced) force_quit = true			
		
		if(!force_quit){
			event.preventDefault()
			mainWindow.hide()
		} else {
			if(!settings.exit_without_ask){
				let select = dialog.showMessageBox({
					type: "question",
					title: "TorrentMedia",
					message: "Are you sure you want to close?",
					defaultId: 0, 
					cancelId: 0, 
					buttons: ["Cancel", "Hide", "Close"]
				})
				if(select === 0) event.preventDefault()
				if(select === 1) {
					mainWindow.hide()
					event.preventDefault() 
				}
			}
		}
	})

	mainWindow.webContents.on('did-finish-load', () => { boot.torrents.load() })


	////*** DevTools ***////
	
	//TODO: if(developer stage)
	//mainWindow.webContents.openDevTools() // Open DevTools
	
	mainWindow.webContents.on("devtools-opened", () => {
		//mainWindow.webContents.closeDevTools() // Evita que se abra DevTools cuando esta en produccion
	})

	////*** End DevTools ***////

	////-- TRAY ICON--////
	appIcon = new Tray(getIconPath('white'))

	const menuTray = [{
						label: "Show",
						click: function(){
							mainWindow.show()
						}
					 },{
						label: "DevTools",
						accelerator: "Alt+Command+I",
						click: function(){
							mainWindow.show()
							mainWindow.toggleDevTools()
						}
					 },{
						type: "separator"
					 },{
						label: "Close",
						accelerator: "Command+Q",
						click: function(){
							force_quit = true
							app.quit()
						}
					 }]
	appIcon.setToolTip('TorrentMedia')
	appIcon.setContextMenu(Menu.buildFromTemplate(menuTray))

	appIcon.on('click', (event, bounds) => {
		settings.tray_blink = false
		settings.tray_color = 'white'

		appIcon.setImage(getIconPath('white'))

		if(mainWindow.isMinimized()) mainWindow.restore()
		else if(mainWindow.isVisible()) mainWindow.hide()
		else mainWindow.show()
	})

})

ipcMain.on('tray', (event, text = '', blink = false, color = 'white') =>{	
	appIcon.setToolTip(text)

	if(!blink) return null

	if(flag){
		appIcon.setImage(getIconPath(color))
		flag = false
	} else {
		appIcon.setImage(getIconPath('white'))
		flag = true
	} 
	
})

ipcMain.on('control', (event, action) => {	
	switch(action) {
		case 'close':
			force_quit = true
			app.quit()
			break
		case 'hide':
			mainWindow.hide()
			break
		case 'fullscreen':
			if(mainWindow.isFullScreen()) mainWindow.setFullScreen(false)
			else mainWindow.setFullScreen(true)
			break
	} 
})

ipcMain.on('torrents', (event, torrents) => {	
	let path = 'App/Torrents'

	storage.remove(path, err => { if(err) console.log(err) })

	storage.set(path, torrents, (err) => { if(err) console.error(err) })
})

ipcMain.on('save-settings', (event, def) => { boot.settings.save(def) })

ipcMain.on('reset-settings', (event) => { settings = boot.settings.install() })



function getIconPath(color){
	return Path.join(__dirname, 'icons/png/icon-down-' + color + '.png')
}