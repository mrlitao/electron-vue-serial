import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      // external: ['serialport', '@serialport/bindings-cpp'], // 添加所有 serialport 相关的模块
    },
  },
});
