import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
// import { getPorts } from './serial-port-utils/serial-port-utils'
// import { SerialPort } from 'serialport';
const { SerialPort } = require('serialport');
console.log('app path:', app.getAppPath());
console.log('resource path:', process.resourcesPath);
try {
  const serialport = require('serialport');
  console.log('serialport loaded:', serialport);
} catch (err) {
  console.error('serialport load error:', err);
}
// app.allowRendererProcessReuse = false;

/**
 * 读取当前设备串口列表
 */
ipcMain.handle("load-device-serial-ports", async () => {
  const ports = await SerialPort.list();
  return ports
  // return [1, 2, 3]
  // mainWindow.webContents.send("load-device-serial-ports", ports)
})

/**
 * 发送串口消息
 * @param {*} event
 * @param {object} data.portPath 串口路径
 * @param {object} data.message 发送的消息
 */
ipcMain.handle("send-serial-port-message", async (event, data) => {
  console.log("send-serial-port-message", {event, data});
  if (!data.portPath || !data.message) {
    return
  }
  const port = new SerialPort({path: data.portPath, baudRate: 115200, autoOpen: false});
  port.on("error", err => {
    console.log("发生错误: " + err.message + "\n");
  });
  port.on("data", data => {
    console.log("收到数据: " + data + "\n");
  })
  port.open(function (err) {
    if (err) {
      console.log("打开串口失败: " + err.message + "\n");
    } else {
      console.log("打开串口成功\n");
    }
  })
  port.write(JSON.stringify(data.message), function (err) {
    if (err) {
      console.log("发送数据失败: " + err.message + "\n");
    } else {
      console.log("发送数据成功\n");
    }
  })
  return port
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 以保证 最少可以使用 require
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
