<script setup lang="ts">
// Removed unused i18n imports
</script>

<template>
  <div class="home-view">
    <h1 class="welcome">Bienvenido a Grupo CESA Platform</h1>
    <div class="logo-container">
      <img class="logo" src="../assets/cesa-logo-full.svg" alt="CESA Logo">
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.welcome {
  font-size: 2rem;
  color: #213547;
  margin-bottom: 2rem;
  font-weight: 600;
}

.logo-container {
  max-width: 400px;
  width: 100%;
}

.logo {
  width: 100%;
  height: auto;
}
</style>