import { SerialPort } from 'serialport';

class SerialPortService {
    constructor() {
        this.port = null;
        this.isConnected = false;
    }

    // 列出所有可用的串口
    async listPorts() {
        try {
            const ports = await SerialPort.list();
            return ports;
        } catch (error) {
            console.error('Error listing ports:', error);
            throw error;
        }
    }

    // 连接到指定的串口
    connect(path, options = {}) {
        return new Promise((resolve, reject) => {
            const defaultOptions = {
                baudRate: 9600,
                dataBits: 8,
                stopBits: 1,
                parity: 'none',
                ...options
            };

            try {
                this.port = new SerialPort({
                    path,
                    ...defaultOptions
                });

                this.port.on('open', () => {
                    console.log('Serial port opened:', path);
                    this.isConnected = true;
                    resolve(true);
                });

                this.port.on('error', (error) => {
                    console.error('Serial port error:', error);
                    this.isConnected = false;
                    reject(error);
                });

                this.port.on('close', () => {
                    console.log('Serial port closed');
                    this.isConnected = false;
                });

                // 设置数据接收处理
                this.port.on('data', (data) => {
                    console.log('Received data:', data.toString());
                    // 这里可以添加数据处理逻辑
                });

            } catch (error) {
                console.error('Error connecting to serial port:', error);
                reject(error);
            }
        });
    }

    // 发送数据
    write(data) {
        return new Promise((resolve, reject) => {
            if (!this.port || !this.isConnected) {
                reject(new Error('Serial port is not connected'));
                return;
            }

            this.port.write(data, (error) => {
                if (error) {
                    console.error('Error writing to serial port:', error);
                    reject(error);
                } else {
                    resolve(true);
                }
            });
        });
    }

    // 断开连接
    disconnect() {
        return new Promise((resolve, reject) => {
            if (!this.port) {
                resolve(true);
                return;
            }

            this.port.close((error) => {
                if (error) {
                    console.error('Error closing serial port:', error);
                    reject(error);
                } else {
                    this.isConnected = false;
                    this.port = null;
                    resolve(true);
                }
            });
        });
    }
}

export default new SerialPortService();