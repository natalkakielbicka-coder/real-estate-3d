<script setup>
import { ref } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'
import PresentationPanel from '../components/presentation/PresentationPanel.vue'

const selectedFloor = ref(null)
const selectedApartment = ref(null)
const threeScene = ref(null)

const panelTransitionDirection = ref('forward')

const handleFloorSelected = (floorData) => {
  selectedFloor.value = floorData
  selectedApartment.value = null
  panelTransitionDirection.value = 'forward'
}

const handleSceneApartmentSelected = (apartment) => {
  panelTransitionDirection.value = 'forward'
  selectedApartment.value = apartment
}

const handlePanelApartmentSelected = (apartment) => {
  panelTransitionDirection.value = 'forward'
  selectedApartment.value = apartment

  threeScene.value?.selectApartmentById?.(apartment.id)
}

const handleApartmentBack = () => {
  panelTransitionDirection.value = 'backward'
  selectedApartment.value = null

  threeScene.value?.clearSelectedApartment?.()
}

const handlePanelClose = () => {
  selectedFloor.value = null
  selectedApartment.value = null

  threeScene.value?.clearSelectedFloor?.()
}

const handleResetView = () => {
  selectedFloor.value = null
  selectedApartment.value = null

  threeScene.value?.resetView?.()
}
</script>

<template>
  <main class="presentation">
    <header class="presentation__header">
      <span class="presentation__label"> Interaktywny model </span>

      <h1>Prezentacja 3D</h1>

      <button type="button" class="presentation__reset" @click="handleResetView">
        Resetuj widok
      </button>
    </header>

    <div
      class="presentation__scene"
      :class="{
        'presentation__scene--panel-open': selectedFloor,
      }"
    >
      <ThreeScene
        ref="threeScene"
        @floor-selected="handleFloorSelected"
        @apartment-selected="handleSceneApartmentSelected"
      />
    </div>

    <Transition name="panel">
      <PresentationPanel
        v-if="selectedFloor"
        :selected-floor="selectedFloor"
        :selected-apartment="selectedApartment"
        :transition-direction="panelTransitionDirection"
        @close="handlePanelClose"
        @apartment-selected="handlePanelApartmentSelected"
        @apartment-back="handleApartmentBack"
      />
    </Transition>
  </main>
</template>

<style scoped>
.presentation {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #101210;
}

.presentation__scene {
  width: 100%;
  height: 100%;
  transition: transform 0.45s ease;
}

.presentation__scene--panel-open {
  transform: translateX(-210px);
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

.panel-enter-active,
.panel-leave-active {
  transition:
    transform 0.45s ease,
    opacity 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.panel-enter-to,
.panel-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.presentation__reset {
  margin-top: 16px;
  padding: 8px 12px;

  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.04);

  color: #a4ada6;
  font-size: 11px;

  cursor: pointer;
}

.presentation__reset:hover {
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.32);
}

@media (max-width: 767px) {
  .presentation__header {
    top: 24px;
    left: 24px;
  }

  .presentation__scene--panel-open {
    transform: none;
  }
}
</style>
