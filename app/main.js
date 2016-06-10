'use strict'

const Electron = require('electron'),
	  Path = require('path'),
	  fs = require('fs'),
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

global.settings = loadSettings()


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
	console.log(process.versions.electron)
	mainWindow = new BrowserWindow ({
									 width: 1200,
									 height: 800,
									 autoHideMenuBar: true,
									 show: !global.settings.start_hide,
									 title: "TorrentMedia",
									 icon: getIconPath('white')
									})
	
	if(global.settings.start_maximized) mainWindow.maximize()
	else if(global.settings.start_minimized) mainWindow.minimize()

	//console.log(global.settings.locale)
	mainWindow.loadURL('file://' + __dirname + '/index-' + global.settings.locale + '.html')

	mainWindow.webContents.openDevTools() // Abre DevTools

	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	mainWindow.on('close', event => {
		if(global.settings.exit_forced) force_quit = true			
		if(!force_quit){
			event.preventDefault()
			mainWindow.hide()
		} else {
			if(!global.settings.exit_without_ask){
				let select = dialog.showMessageBox({
					type: "question",
					title: "TorrentMedia",
					message: "¿Esta seguro que desea cerrar la aplicacion?",
					buttons: ["cancel", "OK"]
				})
				if(select === 0) event.preventDefault()
			}
		}
	})


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
		global.settings.tray_blink = false
		global.settings.tray_color = 'white'

		appIcon.setImage(getIconPath('white'))

		if(mainWindow.isMinimized()) mainWindow.restore()
		else if(mainWindow.isVisible()) mainWindow.hide()
		else mainWindow.show()
	})
})

ipcMain.on('tray', (event, text = '', blink = false, color = 'white') =>{	
	appIcon.setToolTip(text)

	if(blink){
		if(flag){
			appIcon.setImage(getIconPath(color))
			flag = false
		} else {
			appIcon.setImage(getIconPath('white'))
			flag = true
		} 
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



function getIconPath(color){
	return Path.join(__dirname, 'icons/png/icon-down-' + color + '.png')
}


function loadSettings(){
	try	{
		let path = app.getPath('userData') + '/settings.json'
		fs.openSync(path, 'r+')
		return JSON.parse(fs.readFileSync(path, 'utf8'))
	} catch (error) {
		let def = require('./json/settings.default.json')
		return installSettings(def)
		//return require('./json/settings.default.json')
	}

}

function installSettings(def){
	// TODO: Copiar y renombrar settings.json a appdata

	def.dir_downloads = app.getPath('downloads') 
	//osLocale((err, locale) => def.locale = locale)

	return def
}