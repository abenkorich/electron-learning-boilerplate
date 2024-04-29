// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Notification, ipcMain, dialog } = require('electron')
const path = require('node:path')

async function handleFileOpen () {
    const { canceled, filePaths } = await dialog.showOpenDialog()
    if (!canceled) {
      return filePaths[0]
    }
  }

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        devTools: true
      }
    })  
    //console.log(mainWindow.webContents)

    ipcMain.on('set-title', (event, title) => {
        const webContents = event.sender
        const win = BrowserWindow.fromWebContents(webContents)
        win.setTitle(title)
    })

    // used with ipcRenderer.sendSync, 
    // This synchronous model, means that it'll block the renderer process until a reply is received.
    ipcMain.on('synchronous-message', (event, arg) => {
        console.log(arg) // prints "ping" in the Node console
        event.returnValue = 'pong'
      })

    // and load the index.html of the app.
    mainWindow.loadFile('index.html');
    //mainWindow.loadURL('https://www.dzduino.com')

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // show notifications 
    const NOTIFICATION_TITLE = 'Basic Notification'
    const NOTIFICATION_BODY = 'Notification from the Main process'

    new Notification({
        title: NOTIFICATION_TITLE,
        body: NOTIFICATION_BODY
    }).show()

    const CLICK_MESSAGE = 'Notification clicked'

    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () => console.log(CLICK_MESSAGE)
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
