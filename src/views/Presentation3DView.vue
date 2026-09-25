<script setup>
import { ref } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'
import PresentationPanel from '../components/presentation/PresentationPanel.vue'
import PresentationHeader from '../components/presentation/PresentationHeader.vue'
import PresentationIntro from '@/components/presentation/PresentationIntro.vue'
import PresentationSceneToolbar from '../components/presentation/PresentationSceneToolbar.vue'

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

const handleFloorSelectorSelect = (floorNumber) => {
  threeScene.value?.selectFloorByNumber?.(floorNumber)
}
</script>

<template>
  <main class="presentation">
    <PresentationHeader />

    <PresentationIntro @reset="handleResetView" />

    <section class="presentation__stage">
      <PresentationSceneToolbar
        :selected-floor="selectedFloor"
        @select-floor="handleFloorSelectorSelect"
      />

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
    </section>

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
  background: #f7f4ee;
}

.presentation__scene {
  width: 100%;
  height: calc(100% - 64px);
  overflow: hidden;
  transition: transform 0.45s ease;
}

.presentation__stage {
  position: absolute;
  top: 292px;
  right: 28px;
  bottom: 24px;
  left: 28px;
  z-index: 10;
  overflow: visible;
  border: 1px solid #e4e0d7;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 50px rgba(68, 59, 44, 0.08);
}

.presentation__scene--panel-open {
  transform: none;
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

@media (max-width: 767px) {
  .presentation__stage {
    top: 294px;
    right: 12px;
    bottom: 12px;
    left: 12px;
    border-radius: 14px;
  }

  .presentation__scene--panel-open {
    transform: none;
  }
}
</style>
