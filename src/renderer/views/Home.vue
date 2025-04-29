<template>
  <div class="home">
    <h1>Electron Vue Serial</h1>
    <p>串口通信测试工具</p>
    <SerialPortManager />
  </div>
</template>

<script>
import SerialPortManager from '../components/SerialPortManager.vue'

export default {
  name: 'Home',
  components: {
    SerialPortManager
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 30px;
}
</style> 