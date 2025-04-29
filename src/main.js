import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import serialPortService from './node-service/serial-port-utils';

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
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: true,
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

  return mainWindow;
};

// 设置IPC通信
function setupIPC(mainWindow) {
  // 获取串口列表
  ipcMain.handle('serial:list-ports', async () => {
    try {
      const ports = await serialPortService.listPorts();
      return ports;
    } catch (error) {
      console.error('Error listing ports:', error);
      throw error;
    }
  });

  // 连接串口
  ipcMain.handle('serial:connect', async (event, { path, options }) => {
    try {
      await serialPortService.connect(path, options);
      return true;
    } catch (error) {
      console.error('Error connecting to port:', error);
      throw error;
    }
  });

  // 发送数据
  ipcMain.handle('serial:write', async (event, data) => {
    try {
      await serialPortService.write(data);
      return true;
    } catch (error) {
      console.error('Error writing to port:', error);
      throw error;
    }
  });

  // 断开连接
  ipcMain.handle('serial:disconnect', async () => {
    try {
      await serialPortService.disconnect();
      return true;
    } catch (error) {
      console.error('Error disconnecting port:', error);
      throw error;
    }
  });

  // 监听串口数据
  serialPortService.port?.on('data', (data) => {
    mainWindow.webContents.send('serial:data', data.toString());
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  const mainWindow = createWindow();
  // setupIPC(mainWindow);

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

// 应用退出时清理
app.on('before-quit', async () => {
  await serialPortService.disconnect();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
