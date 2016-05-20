'use strict'

const electron = require('electron'),
	  path = require('path'),
	  app = electron.app,
	  Menu = electron.Menu,
	  MenuItem = electron.MenuItem,
	  Tray = electron.Tray,
	  BrowserWindow = electron.BrowserWindow

var mainWindow = null,
	appIcon = null

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
	let iconPath = path.join(__dirname, 'front/icons/png/icon-down-blue.png')
	appIcon = new Tray(iconPath)

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
						selector: "terminate"
					}]
	const contextMenu = Menu.buildFromTemplate(menuTray)
	appIcon.setToolTip('S:10 Kb/s  D:10 Kb/s')
	appIcon.setContextMenu(contextMenu)

})