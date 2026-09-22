<script setup>
import ThreeScene from '../components/three/ThreeScene.vue'
</script>

<template>
  <main class="presentation">
    <header class="presentation__header">
      <span class="presentation__label"> Interactive model </span>

      <h1>Prezentacja 3D</h1>
    </header>

    <ThreeScene />
  </main>
</template>

<style scoped>
.presentation {
  position: relative;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: #101210;
}

.presentation__header {
  position: absolute;
  top: 40px;
  left: 48px;
  z-index: 10;
}

.presentation__label {
  display: block;
  margin-bottom: 8px;
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #7f8981;
}

.presentation h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 400;
  color: #f5f5f2;
}

@media (max-width: 768px) {
  .presentation__header {
    top: 24px;
    left: 24px;
  }
}
</style>
