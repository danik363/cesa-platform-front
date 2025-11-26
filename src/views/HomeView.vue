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
  padding: var(--spacing-2xl);
}

.welcome {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2xl);
  font-weight: var(--font-weight-semibold);
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