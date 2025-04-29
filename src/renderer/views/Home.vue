<template>
  <div class="home">
    <button @click="getAll">获取所有串口列表</button>
    <div>
      {{list}}
    </div>
    <router-link to="/about" class="nav-link">About</router-link>
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import { getPorts } from '../../serial-port-utils/serial-port-utils';

const list = shallowRef([]);

const getAll = async () => {
  try {
    const ports = await getPorts();
    list.value = ports;
  } catch (error) {
    console.error('获取串口列表失败:', error);
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.features {
  margin-top: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.nav-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.nav-link:hover {
  background-color: #3aa876;
}
</style> 