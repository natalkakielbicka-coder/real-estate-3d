<script setup>
import { ref } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'

const selectedFloor = ref(null)

const handleFloorSelected = (floorData) => {
  selectedFloor.value = floorData
}
</script>

<template>
  <main class="presentation">
    <header class="presentation__header">
      <span class="presentation__label"> Interactive model </span>

      <h1>Prezentacja 3D</h1>
    </header>

    <ThreeScene @floor-selected="handleFloorSelected" />

    <aside class="floor-panel">
      <span class="floor-panel__label">
        {{ selectedFloor ? 'Wybrana kondygnacja' : 'Wybierz kondygnację' }}
      </span>

      <strong class="floor-panel__title">
        {{
          selectedFloor
            ? selectedFloor.floorNumber === 0
              ? 'Parter'
              : `Piętro ${selectedFloor.floorNumber}`
            : 'Kliknij piętro na budynku'
        }}
      </strong>

      <p class="floor-panel__description">
        {{
          selectedFloor
            ? 'Kondygnacja została wybrana. W kolejnych krokach pokażemy tutaj dostępne mieszkania.'
            : 'Najedź kursorem na budynek i kliknij wybraną kondygnację, aby zobaczyć jej szczegóły.'
        }}
      </p>

      <div v-if="selectedFloor" class="floor-panel__details">
        <div class="floor-panel__detail">
          <span>Budynek</span>

          <strong>
            {{ selectedFloor.buildingName }}
          </strong>
        </div>

        <div class="floor-panel__detail">
          <span>Mieszkania</span>

          <strong>
            {{ selectedFloor.apartmentCount }}
          </strong>
        </div>

        <div class="floor-panel__detail">
          <span>Dostępne</span>

          <strong>
            {{ selectedFloor.availableApartments }}
          </strong>
        </div>
      </div>
    </aside>
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

.floor-panel {
  position: absolute;
  right: 40px;
  bottom: 40px;
  z-index: 10;

  width: min(360px, calc(100% - 80px));
  padding: 24px;

  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(26, 30, 27, 0.96);

  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);

  backdrop-filter: blur(14px);
}

.floor-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 3px;

  background: #8d7658;
}

.floor-panel__label {
  display: block;
  margin-bottom: 12px;

  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;

  color: #a4ada6;
}

.floor-panel__title {
  display: block;

  font-size: 26px;
  font-weight: 400;
  line-height: 1.15;

  color: #ffffff;
}

.floor-panel__description {
  margin: 14px 0 0;

  font-size: 14px;
  line-height: 1.6;

  color: #abb2ad;
}

.floor-panel__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.floor-panel__detail {
  min-width: 0;
}

.floor-panel__detail span {
  display: block;
  margin-bottom: 6px;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #79827c;
}

.floor-panel__detail strong {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #f5f5f2;
}

@media (max-width: 767px) {
  .presentation__header {
    top: 24px;
    left: 24px;
  }

  .floor-panel {
    right: 24px;
    bottom: 24px;
    left: 24px;
  }
}
</style>
