// Modules to control application life and create native browser window
const {app, BrowserWindow, dialog} = require('electron')
const path = require('path')
const sqlite = require('sqlite3')
const dbName = 'registry.db'
const dbVersion = '2'

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.setMenu(null)
  mainWindow.maximize()

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
}

function initializeDb () {
  return new Promise(function (resolve, reject) {
    var db = new sqlite.Database(dbName, sqlite.OPEN_READONLY, function (error) {
      if (null === error) {
        db.get('SELECT version FROM metadata', [], function(error, row) {
          var version = row['version']
          db.close(function (error) {
            if (version !== dbVersion) {
              reject('Unexpected database version. Expected ' + dbVersion + ' but ' + JSON.stringify(version) + ' was found')
            } else {
              resolve()
            }
          })
        })
      } else {
        db = new sqlite.Database(dbName, (sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE), function (error) {
          if (null === error) {
            db.exec(
              'CREATE TABLE metadata (version TEXT(15) NOT NULL, creation_date TEXT(19) NOT NULL, modification_date TEXT(19) NOT NULL);' +
              "INSERT INTO metadata (version, creation_date, modification_date) VALUES ('" + dbVersion + "', DATETIME('now'), DATETIME('now'));" +
              'CREATE TABLE registry (id INTEGER PRIMARY KEY, name TEXT(100) NULL, creation_date TEXT(19) NOT NULL, modification_date TEXT(19) NOT NULL);' +
              'CREATE TABLE row (id INTEGER PRIMARY KEY, registry_id INTEGER NOT NULL, product TEXT(100) NOT NULL, quantity INTEGER NOT NULL, amount REAL NOT NULL, creation_date TEXT(23) NOT NULL);',
              function (error) {
                var initializationError = error;
                db.close(function (error) {
                  if (null === initializationError) {
                    resolve()
                  } else {
                    reject('Cannot initialize database: ' + JSON.stringify(initializationError))
                  }
                })
              }
            )
          } else {
            reject('Cannot create database: ' + JSON.stringify(error))
          }
        })
      }
    })
  })
}

function throwError (message) {
  dialog.showErrorBox('Error', message)
  throw message
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  initializeDb().then(() => {
    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  }, throwError)
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
