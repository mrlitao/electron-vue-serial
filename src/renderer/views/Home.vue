<template>
  <div class="home">
    <h1>Welcome to Electron Vue Serial</h1>
    <p>This is a cross-platform application built with Electron and Vue 3.</p>
    <div class="features">
      <h2>Features:</h2>
      <ul>
        <li>Electron for cross-platform desktop app</li>
        <li>Vue 3 for modern UI development</li>
        <li>Vite for fast development</li>
        <li>Vue Router for navigation</li>
        <li>Serial port communication (coming soon)</li>
      </ul>
    </div>
    <router-link to="/about" class="nav-link">About</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
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