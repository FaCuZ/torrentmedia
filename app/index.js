'use strict'

const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow = null

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
});

console.log("dir"+__dirname)
app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.webContents.openDevTools(); // Abre DevTools

  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
});