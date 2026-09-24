<script setup>
import { ref } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'
import PresentationPanel from '../components/presentation/PresentationPanel.vue'
import PresentationHeader from '../components/presentation/PresentationHeader.vue'
import PresentationIntro from '@/components/presentation/PresentationIntro.vue'

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

const handleApartmentHover = (apartment) => {
  threeScene.value?.hoverApartmentById?.(apartment.id)
}

const handleApartmentHoverEnd = () => {
  threeScene.value?.clearApartmentHover?.()
}
</script>

<template>
  <main class="presentation">
    <PresentationHeader />

    <PresentationIntro @reset="handleResetView" />

    <div class="presentation__legend">
      <div class="presentation__legend-item">
        <span class="presentation__legend-dot presentation__legend-dot--available"></span>
        Dostępne
      </div>

      <div class="presentation__legend-item">
        <span class="presentation__legend-dot presentation__legend-dot--reserved"></span>
        Zarezerwowane
      </div>

      <div class="presentation__legend-item">
        <span class="presentation__legend-dot presentation__legend-dot--sold"></span>
        Sprzedane
      </div>
    </div>

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
        @apartment-hover="handleApartmentHover"
        @apartment-hover-end="handleApartmentHoverEnd"
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

.presentation__legend {
  position: absolute;
  bottom: 32px;
  left: 48px;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(16, 18, 16, 0.72);
  backdrop-filter: blur(10px);
}

.presentation__legend-item {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #a4ada6;
  font-size: 10px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.presentation__legend-dot {
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
}

.presentation__legend-dot--available {
  background: #6f8f75;
}

.presentation__legend-dot--reserved {
  background: #9b8050;
}

.presentation__legend-dot--sold {
  background: #666b67;
}

@media (max-width: 767px) {
  .presentation__scene--panel-open {
    transform: none;
  }

  .presentation__legend {
    bottom: 20px;
    left: 24px;
    gap: 10px;
    padding: 10px 12px;
  }

  .presentation__legend-item {
    font-size: 9px;
  }
}
</style>
