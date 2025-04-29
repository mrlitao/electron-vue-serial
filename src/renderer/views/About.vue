<template>
  <div class="about">
    <h1>About This Application</h1>
    <p>This is an Electron application built with modern web technologies:</p>
    <ul>
      <li>Electron - for building cross-platform desktop applications</li>
      <li>Vue 3 - for reactive UI components</li>
      <li>Vite - for fast development and building</li>
      <li>Vue Router - for client-side routing</li>
      <li>Electron Forge - for packaging and distribution</li>
    </ul>
    <p>This application will support serial port communication for hardware interaction.</p>
    <router-link to="/" class="nav-link">Back to Home</router-link>
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

ul {
  margin: 20px 0;
  padding-left: 20px;
}

li {
  margin: 10px 0;
}

.nav-link {
  display: inline-block;
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