<template>
  <div class="about">
    <h1>关于</h1>
    <p>这是一个基于 Electron + Vue3 的串口通信工具，支持以下功能：</p>
    <ul>
      <li>串口设备自动发现</li>
      <li>串口连接管理</li>
      <li>数据发送和接收</li>
      <li>跨平台支持 (Windows, macOS, Linux)</li>
    </ul>
    <router-link to="/" class="nav-link">返回首页</router-link>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

ul {
  margin: 20px 0;
  padding-left: 20px;
}

li {
  margin: 10px 0;
  color: #666;
}

.nav-link {
  display: inline-block;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 20px;
}

.nav-link:hover {
  background-color: #3aa876;
}
</style> 