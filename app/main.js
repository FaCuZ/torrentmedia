'use strict'

const Electron = require('electron'),
	  Path = require('path'),
	  ipcMain = Electron.ipcMain,
	  app = Electron.app,
	  Menu = Electron.Menu,
	  MenuItem = Electron.MenuItem,
	  Tray = Electron.Tray,
	  BrowserWindow = Electron.BrowserWindow

var mainWindow = null,
	appIcon = null,
	flag = true

app.on('window-all-closed', function() {
	if (process.platform != 'darwin') {
		app.quit()
	}
});

app.on('ready', function() {
	mainWindow = new BrowserWindow ({
									width: 1200,
									height: 800,
									autoHideMenuBar: true,
									title: "TorrentMedia"
									})

	mainWindow.loadURL('file://' + __dirname + '/front/index.html')

	mainWindow.webContents.openDevTools() // Abre DevTools

	mainWindow.on('closed', function() {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	})

	////-- TRAY ICON--////
	appIcon = new Tray(getIconPath('white'))

	const menuTray = [{
						label: "DevTools",
						accelerator: "Alt+Command+I",
						click: function(){
							mainWindow.show()
							mainWindow.toggleDevTools()
						}
					 },{
						type: "separator"
					 },{
						label: "Cerrar",
						accelerator: "Command+Q",
						click: function(){
							mainWindow.close()
						}
					 }]
	appIcon.setToolTip('TorrentMedia')
	appIcon.setContextMenu(Menu.buildFromTemplate(menuTray))

})

ipcMain.on('tray', function (event, text, blink = false, color = white) {	
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

function getIconPath(color){
	return Path.join(__dirname, 'front/icons/png/icon-down-' + color + '.png')
}