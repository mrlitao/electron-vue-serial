// const { SerialPort } = require('serialport');
// https://www.cnblogs.com/reachteam/p/17696071.html
import { SerialPort } from 'serialport';
// 获得串口列表代码
export async function getPorts () {
    const ports = await SerialPort.list();
    return ports
}

export async function openSerialPort(portPath) {
    const port = new SerialPort({path: "COM1", baudRate: 9600, autoOpen: false});

    port.on("error", err => {
        console.log("发生错误: " + err.message + "\n");
    });

    port.on("data", data => {
        console.log("收到数据: " + data + "\n");
    });

    port.open(function (err) {
        if (err) {
            console.log("端口打开失败: " + err.message + "\n");
            return;
        }
        console.log("打开端口成功" + "\n");
    });
    // port.write("hello world");   // 发送数据
    return port;
}