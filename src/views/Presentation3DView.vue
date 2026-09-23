<script setup>
import { ref } from 'vue'
import ThreeScene from '../components/three/ThreeScene.vue'
import { apartmentStatusLabels } from '../constants/apartmentStatuses'
import { getRoomsLabel } from '../utils/apartmentFormatters'

const selectedFloor = ref(null)
const selectedApartment = ref(null)

const handleFloorSelected = (floorData) => {
  selectedFloor.value = floorData
  selectedApartment.value = null
}

const handleApartmentSelected = (apartment) => {
  selectedApartment.value = apartment
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

      <div v-if="selectedFloor" class="floor-panel__apartments">
        <span class="floor-panel__apartments-title"> Mieszkania na kondygnacji </span>

        <div class="floor-panel__apartments-list">
          <button
            v-for="apartment in selectedFloor.apartments"
            :key="apartment.id"
            type="button"
            class="apartment-row"
            :class="{
              'apartment-row--selected': selectedApartment?.id === apartment.id,
            }"
            @click="handleApartmentSelected(apartment)"
          >
            <div class="apartment-row__main">
              <strong>
                {{ apartment.number }}
              </strong>

              <span>
                {{ getRoomsLabel(apartment.rooms) }}
                ·
                {{ apartment.area }} m²
              </span>
            </div>

            <span
              class="apartment-row__status"
              :class="`apartment-row__status--${apartment.status}`"
            >
              {{ apartmentStatusLabels[apartment.status] }}
            </span>
          </button>
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

  width: min(420px, calc(100% - 80px));
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

.floor-panel__apartments {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.floor-panel__apartments-title {
  display: block;
  margin-bottom: 12px;

  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;

  color: #a4ada6;
}

.floor-panel__apartments-list {
  display: grid;
  gap: 8px;
}

.apartment-row {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  padding: 11px 12px;

  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);

  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.apartment-row:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.07);
}

.apartment-row--selected {
  border-color: #8d7658;
  background: rgba(141, 118, 88, 0.16);
}

.apartment-row:focus-visible {
  outline: 2px solid #8d7658;
  outline-offset: 2px;
}

.apartment-row__main {
  min-width: 0;
}

.apartment-row__main strong {
  display: block;
  margin-bottom: 3px;

  font-size: 14px;
  font-weight: 500;

  color: #f5f5f2;
}

.apartment-row__main span {
  display: block;

  font-size: 11px;

  color: #89918b;
}

.apartment-row__status {
  flex-shrink: 0;

  padding: 5px 7px;

  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.apartment-row__status--available {
  color: #b9d2bf;
  background: rgba(91, 138, 103, 0.18);
}

.apartment-row__status--reserved {
  color: #d8c79e;
  background: rgba(159, 128, 67, 0.18);
}

.apartment-row__status--sold {
  color: #a7aaa8;
  background: rgba(255, 255, 255, 0.07);
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
