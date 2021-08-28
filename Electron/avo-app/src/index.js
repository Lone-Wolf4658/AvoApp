const { app, BrowserWindow } = require('electron');
const path = require('path');
const {getIp, sendCommand} = require('./util');
const { ipcMain } = require('electron')
let window


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  window = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    }
  });
  // Remove Toolbar Menu
  window.setMenuBarVisibility(false) //partially

  // and load the index.html of the app.
  window.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  window.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// Event from render.js
// Checking new IP
ipcMain.on('check-new-ip', (event, ip) => {
  // Checking if the ip is valid. And returning TITAN version
  sendCommand(ip, `get/2/System/SoftwareVersion`)
  .then(res => {
    // We are good to go!
    event.reply("console-ip", {ip, runtimeVersion: res});
  }).catch(err => {
    // Checking For the noConsole error
    if(err.message.slice(0, 12) === "BAD request!"){
      return event.returnValue = false;
    };
    console.error(err);
  })

})

// Event from render.js
// Finding Local IP using util function getIp()
ipcMain.on('get-Local-Ip', event => {
  const ip = getIp();
  event.reply('new-Local-Ip', ip);
})

