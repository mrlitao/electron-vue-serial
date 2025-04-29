<template>
  <div class="serial-manager">
    <div class="port-selector">
      <h3>串口管理</h3>
      <div class="controls">
        <select v-model="selectedPort" :disabled="isConnected">
          <option value="">选择串口</option>
          <option v-for="port in ports" :key="port.path" :value="port.path">
            {{ port.path }} - {{ port.manufacturer || '未知设备' }}
          </option>
        </select>
        <button @click="refreshPorts" :disabled="isConnected">刷新</button>
        <button @click="toggleConnection" :class="{ connected: isConnected }">
          {{ isConnected ? '断开连接' : '连接' }}
        </button>
      </div>
    </div>

    <div class="communication" v-if="isConnected">
      <div class="received-data">
        <h4>接收数据</h4>
        <div class="data-display" ref="dataDisplay">
          <div v-for="(data, index) in receivedData" :key="index" class="data-item">
            {{ data }}
          </div>
        </div>
      </div>

      <div class="send-data">
        <h4>发送数据</h4>
        <div class="input-group">
          <input v-model="dataToSend" placeholder="输入要发送的数据" @keyup.enter="sendData" />
          <button @click="sendData" :disabled="!dataToSend">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SerialPortManager',
  data() {
    return {
      ports: [],
      selectedPort: '',
      isConnected: false,
      receivedData: [],
      dataToSend: '',
    }
  },
  mounted() {
    this.refreshPorts()
    // 设置串口数据监听
    window.electronAPI.onSerialData((data) => {
      this.receivedData.push(data)
      this.$nextTick(() => {
        if (this.$refs.dataDisplay) {
          this.$refs.dataDisplay.scrollTop = this.$refs.dataDisplay.scrollHeight
        }
      })
    })
  },
  beforeUnmount() {
    // 清理监听器
    window.electronAPI.removeSerialDataListener()
    // 如果还连接着，断开连接
    if (this.isConnected) {
      this.disconnect()
    }
  },
  methods: {
    async refreshPorts() {
      try {
        this.ports = await window.electronAPI.listPorts()
      } catch (error) {
        console.error('Error listing ports:', error)
        alert('获取串口列表失败')
      }
    },
    async toggleConnection() {
      if (this.isConnected) {
        await this.disconnect()
      } else {
        await this.connect()
      }
    },
    async connect() {
      if (!this.selectedPort) {
        alert('请选择一个串口')
        return
      }

      try {
        await window.electronAPI.connect(this.selectedPort, {
          baudRate: 9600,
          dataBits: 8,
          stopBits: 1,
          parity: 'none'
        })
        this.isConnected = true
        this.receivedData = [] // 清空之前的数据
      } catch (error) {
        console.error('Connection error:', error)
        alert('连接失败：' + error.message)
      }
    },
    async disconnect() {
      try {
        await window.electronAPI.disconnect()
        this.isConnected = false
      } catch (error) {
        console.error('Disconnection error:', error)
        alert('断开连接失败：' + error.message)
      }
    },
    async sendData() {
      if (!this.dataToSend.trim()) return

      try {
        await window.electronAPI.write(this.dataToSend)
        this.dataToSend = '' // 清空输入
      } catch (error) {
        console.error('Send data error:', error)
        alert('发送数据失败：' + error.message)
      }
    }
  }
}
</script>

<style scoped>
.serial-manager {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.port-selector {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

select {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #42b983;
  background-color: white;
  color: #42b983;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover:not(:disabled) {
  background-color: #42b983;
  color: white;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.connected {
  background-color: #ff6b6b;
  border-color: #ff6b6b;
  color: white;
}

.communication {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.received-data, .send-data {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}

.data-display {
  height: 200px;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
  margin-top: 10px;
  background-color: #f9f9f9;
}

.data-item {
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

input {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

h3, h4 {
  margin: 0;
  color: #2c3e50;
}

h4 {
  margin-bottom: 10px;
}
</style> 