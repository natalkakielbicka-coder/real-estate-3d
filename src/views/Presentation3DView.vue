<script setup>
import { ref, watch } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'
import PresentationPanel from '../components/presentation/PresentationPanel.vue'
import PresentationHeader from '../components/presentation/PresentationHeader.vue'
import PresentationIntro from '@/components/presentation/PresentationIntro.vue'
import PresentationSceneToolbar from '../components/presentation/PresentationSceneToolbar.vue'
import ApartmentFloorPlan from '@/components/floor-plan/ApartmentFloorPlan.vue'
import { usePresentationState } from '@/composables/usePresentationState'
import { usePresentationQuerySync } from '@/composables/usePresentationQuerySync'

const threeScene = ref(null)
const isFloorPlanOpen = ref(false)

const {
  selectedFloor,
  selectedApartment,
  panelTransitionDirection,
  handleFloorSelected,
  handleSceneApartmentSelected,
  handlePanelApartmentSelected,
  handleApartmentBack,
  handlePanelClose,
  handleResetView,
  handleApartmentHover,
  handleApartmentHoverEnd,
  handleFloorSelectorSelect,
  handleSearchApartmentSelect,
  handleSearchResults,
  handleSearchClear,
} = usePresentationState({ threeScene })

const openFloorPlan = () => {
  if (!selectedApartment.value) return

  isFloorPlanOpen.value = true
}

const closeFloorPlan = () => {
  isFloorPlanOpen.value = false
}

watch(
  () => selectedApartment.value?.id,
  () => {
    closeFloorPlan()
  },
)

usePresentationQuerySync({
  threeScene,
  selectedFloor,
  selectedApartment,
  onClose: handlePanelClose,
  onApartmentSelect: handlePanelApartmentSelected,
  onApartmentBack: handleApartmentBack,
})
</script>

<template>
  <main class="presentation">
    <PresentationHeader />

    <PresentationIntro @reset="handleResetView" />

    <section class="presentation__stage">
      <PresentationSceneToolbar
        :selected-floor="selectedFloor"
        @select-floor="handleFloorSelectorSelect"
        @select-apartment="handleSearchApartmentSelect"
        @filter-results="handleSearchResults"
        @clear-filter-results="handleSearchClear"
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
        @open-floor-plan="openFloorPlan"
      />
    </Transition>

    <Transition name="floor-plan-modal">
      <div v-if="isFloorPlanOpen && selectedApartment" class="floor-plan-modal">
        <div class="floor-plan-modal__backdrop" @click="closeFloorPlan"></div>

        <section
          class="floor-plan-modal__dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="floor-plan-title"
        >
          <div class="floor-plan-modal__header">
            <div>
              <span class="floor-plan-modal__eyebrow"> Rzut mieszkania </span>

              <h2 id="floor-plan-title">Mieszkanie {{ selectedApartment.number }}</h2>

              <p>Powierzchnia: {{ selectedApartment.area }} m²</p>
            </div>

            <button
              type="button"
              class="floor-plan-modal__close"
              aria-label="Zamknij rzut mieszkania"
              @click="closeFloorPlan"
            >
              ×
            </button>
          </div>

          <div class="floor-plan-modal__body">
            <ApartmentFloorPlan :apartment="selectedApartment" />
          </div>
        </section>
      </div>
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
  position: relative;
  z-index: 1;
  width: 100%;
  height: calc(100% - 56px);
  overflow: hidden;
  border-radius: 0 0 18px 18px;
  transition: transform 0.45s ease;
}

.presentation__stage {
  position: absolute;
  top: clamp(220px, 28vh, 292px);
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
  transform: translateX(clamp(-180px, -12vw, -90px));
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

.floor-plan-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.floor-plan-modal__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(22, 30, 20, 0.65);
  backdrop-filter: blur(6px);
}

.floor-plan-modal__dialog {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  max-height: 90vh;
  overflow-y: auto;
  padding: clamp(1.25rem, 3vw, 2.5rem);
  border-radius: 1.25rem;
  background: #fff;
  box-shadow: 0 1.5rem 5rem rgba(0, 0, 0, 0.2);
}

.floor-plan-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.floor-plan-modal__eyebrow {
  color: #899c80;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.floor-plan-modal__header h2 {
  margin: 0.5rem 0;
  color: #34452f;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.floor-plan-modal__header p {
  margin: 0;
  color: #747e70;
}

.floor-plan-modal__close {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 1px solid #e2ded5;
  border-radius: 50%;
  background: #f7f4ee;
  color: #34452f;
  font-size: 1.5rem;
  cursor: pointer;
}

.floor-plan-modal__body {
  width: 100%;
}

.floor-plan-modal-enter-active,
.floor-plan-modal-leave-active {
  transition: opacity 0.25s ease;
}

.floor-plan-modal-enter-from,
.floor-plan-modal-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .presentation__stage {
    top: 230px;
    right: 12px;
    bottom: 12px;
    left: 12px;
    border-radius: 14px;
  }

  .presentation__scene--panel-open {
    transform: none;
  }

  .floor-plan-modal {
    padding: 0.75rem;
  }

  .floor-plan-modal__dialog {
    max-height: 95vh;
    padding: 1rem;
  }
}
</style>
