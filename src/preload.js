// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // 获取可用串口列表
  listPorts: () => ipcRenderer.invoke('serial:list-ports'),
  
  // 连接到串口
  connect: (path, options) => ipcRenderer.invoke('serial:connect', { path, options }),
  
  // 发送数据
  write: (data) => ipcRenderer.invoke('serial:write', data),
  
  // 断开连接
  disconnect: () => ipcRenderer.invoke('serial:disconnect'),
  
  // 监听串口数据
  onSerialData: (callback) => {
    ipcRenderer.on('serial:data', (event, value) => callback(value));
  },
  
  // 移除数据监听
  removeSerialDataListener: () => {
    ipcRenderer.removeAllListeners('serial:data');
  }
});
