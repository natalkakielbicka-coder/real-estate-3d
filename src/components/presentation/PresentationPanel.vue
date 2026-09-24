<script setup>
import { computed } from 'vue'
import { apartmentStatusLabels } from '../../constants/apartmentStatuses'
import { getRoomsLabel, formatPrice } from '../../utils/apartmentFormatters'

const props = defineProps({
  selectedFloor: {
    type: Object,
    required: true,
  },
  selectedApartment: {
    type: Object,
    default: null,
  },
  transitionDirection: {
    type: String,
    default: 'forward',
  },
})

const emit = defineEmits([
  'close',
  'apartment-selected',
  'apartment-back',
  'apartment-hover',
  'apartment-hover-end',
])

const apartmentStatusOrder = {
  available: 0,
  reserved: 1,
  sold: 2,
}

const sortedApartments = computed(() => {
  return [...props.selectedFloor.apartments].sort((a, b) => {
    return apartmentStatusOrder[a.status] - apartmentStatusOrder[b.status]
  })
})

const selectableApartments = computed(() => {
  return props.selectedFloor.apartments.filter((apartment) => apartment.status !== 'sold')
})

const currentApartmentIndex = computed(() => {
  return selectableApartments.value.findIndex(
    (apartment) => apartment.id === props.selectedApartment?.id,
  )
})

const previousApartment = computed(() => {
  if (currentApartmentIndex.value <= 0) {
    return null
  }

  return selectableApartments.value[currentApartmentIndex.value - 1]
})

const nextApartment = computed(() => {
  if (
    currentApartmentIndex.value === -1 ||
    currentApartmentIndex.value >= selectableApartments.value.length - 1
  ) {
    return null
  }

  return selectableApartments.value[currentApartmentIndex.value + 1]
})
</script>

<template>
  <aside class="floor-panel">
    <button
      type="button"
      class="floor-panel__close"
      aria-label="Zamknij panel"
      @click="emit('close')"
    >
      ×
    </button>

    <Transition
      :name="transitionDirection === 'backward' ? 'panel-content-back' : 'panel-content-forward'"
    >
      <!-- MIESZKANIE -->
      <div v-if="selectedApartment" :key="selectedApartment.id" class="floor-panel__content">
        <button type="button" class="floor-panel__back" @click="emit('apartment-back')">
          ← Wróć do piętra
        </button>

        <span class="floor-panel__label"> Mieszkanie </span>

        <strong class="floor-panel__title">
          {{ selectedApartment.number }}
        </strong>

        <span
          class="apartment-details__status"
          :class="`apartment-row__status--${selectedApartment.status}`"
        >
          {{ apartmentStatusLabels[selectedApartment.status] }}
        </span>

        <div class="apartment-details">
          <div class="apartment-details__item">
            <span>Powierzchnia</span>
            <strong>{{ selectedApartment.area }} m²</strong>
          </div>

          <div class="apartment-details__item">
            <span>Pokoje</span>
            <strong>
              {{ getRoomsLabel(selectedApartment.rooms) }}
            </strong>
          </div>

          <div class="apartment-details__item">
            <span>Piętro</span>
            <strong>
              {{
                selectedFloor.floorNumber === 0 ? 'Parter' : `Piętro ${selectedFloor.floorNumber}`
              }}
            </strong>
          </div>

          <div class="apartment-details__item">
            <span>Budynek</span>
            <strong>{{ selectedFloor.buildingName }}</strong>
          </div>

          <div class="apartment-details__item">
            <span>Cena</span>
            <strong>{{ formatPrice(selectedApartment.price) }}</strong>
          </div>

          <div class="apartment-details__item">
            <span>Cena za m²</span>
            <strong>
              {{ formatPrice(selectedApartment.price / selectedApartment.area) }}
            </strong>
          </div>
        </div>

        <div class="apartment-details__navigation">
          <button
            type="button"
            class="apartment-details__navigation-button"
            :disabled="!previousApartment"
            @click="emit('apartment-selected', previousApartment)"
          >
            ← Poprzednie
          </button>

          <button
            type="button"
            class="apartment-details__navigation-button"
            :disabled="!nextApartment"
            @click="emit('apartment-selected', nextApartment)"
          >
            Następne →
          </button>
        </div>
      </div>

      <!-- PIĘTRO -->
      <div
        v-else
        :key="`floor-${selectedFloor.buildingId}-${selectedFloor.floorNumber}`"
        class="floor-panel__content"
      >
        <span class="floor-panel__label"> Wybrana kondygnacja </span>

        <strong class="floor-panel__title">
          {{ selectedFloor.floorNumber === 0 ? 'Parter' : `Piętro ${selectedFloor.floorNumber}` }}
        </strong>

        <p class="floor-panel__description">
          Wybierz mieszkanie z listy, aby zobaczyć jego szczegóły.
        </p>

        <div class="floor-panel__availability">
          <div class="floor-panel__availability-header">
            <span>Dostępność</span>

            <strong>
              {{ selectedFloor.availableApartments }} z {{ selectedFloor.apartmentCount }}
            </strong>
          </div>

          <div class="floor-panel__availability-track">
            <span
              class="floor-panel__availability-progress"
              :style="{
                width: `${(selectedFloor.availableApartments / selectedFloor.apartmentCount) * 100}%`,
              }"
            ></span>
          </div>
        </div>

        <div class="floor-panel__details">
          <div class="floor-panel__detail">
            <span>Budynek</span>
            <strong>{{ selectedFloor.buildingName }}</strong>
          </div>

          <div class="floor-panel__detail">
            <span>Mieszkania</span>
            <strong>{{ selectedFloor.apartmentCount }}</strong>
          </div>

          <div class="floor-panel__detail">
            <span>Piętro</span>
            <strong>
              {{ selectedFloor.floorNumber === 0 ? 'Parter' : selectedFloor.floorNumber }}
            </strong>
          </div>
        </div>

        <div class="floor-panel__apartments">
          <span class="floor-panel__apartments-title"> Mieszkania na kondygnacji </span>

          <div class="floor-panel__apartments-list">
            <button
              v-for="apartment in sortedApartments"
              :key="apartment.id"
              type="button"
              class="apartment-row"
              :disabled="apartment.status === 'sold'"
              @click="emit('apartment-selected', apartment)"
              @mouseenter="emit('apartment-hover', apartment)"
              @mouseleave="emit('apartment-hover-end')"
            >
              <div class="apartment-row__main">
                <strong>{{ apartment.number }}</strong>

                <span>
                  {{ getRoomsLabel(apartment.rooms) }}
                  ·
                  {{ apartment.area }} m²
                </span>

                <span class="apartment-row__price">
                  {{ formatPrice(apartment.price) }}
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
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.floor-panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  width: 420px;
  padding: 32px 24px;
  overflow-x: hidden;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(24, 27, 24, 0.98);
  box-shadow: -24px 0 70px rgba(0, 0, 0, 0.35);
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

.floor-panel__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #f5f5f2;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.floor-panel__close:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.floor-panel__close:focus-visible,
.floor-panel__back:focus-visible {
  outline: 2px solid #8d7658;
  outline-offset: 3px;
}

.floor-panel__back {
  display: inline-flex;
  align-items: center;
  margin: 0 0 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #a4ada6;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}

.floor-panel__back:hover {
  color: #ffffff;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
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

.apartment-row:focus-visible {
  outline: 2px solid #8d7658;
  outline-offset: 2px;
}

.apartment-row:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.apartment-row:disabled:hover {
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.035);
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

.apartment-row__price {
  margin-top: 5px;
  font-size: 12px !important;
  font-weight: 500;
  color: #d8ddd9 !important;
}

.apartment-details__status {
  display: inline-block;
  margin-top: 14px;
  padding: 6px 9px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.apartment-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  margin-top: 28px;
  background: rgba(255, 255, 255, 0.1);
}

.apartment-details__item {
  padding: 18px;
  background: #181b18;
}

.apartment-details__item span {
  display: block;
  margin-bottom: 8px;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #79827c;
}

.apartment-details__item strong {
  display: block;
  font-size: 17px;
  font-weight: 400;
  color: #f5f5f2;
}

.floor-panel__content {
  min-height: 100%;
}

.panel-content-forward-enter-active,
.panel-content-forward-leave-active,
.panel-content-back-enter-active,
.panel-content-back-leave-active {
  transition:
    transform 0.34s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.16s ease;
}

.panel-content-forward-enter-from {
  transform: translateX(32px);
  opacity: 0;
}

.panel-content-forward-leave-to {
  transform: translateX(-16px);
  opacity: 0;
}

.panel-content-back-enter-from {
  transform: translateX(-32px);
  opacity: 0;
}

.panel-content-back-leave-to {
  transform: translateX(16px);
  opacity: 0;
}

.floor-panel__availability {
  margin-top: 20px;
}

.floor-panel__availability-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #79827c;
}

.floor-panel__availability-header strong {
  font-size: 11px;
  font-weight: 500;
  color: #b9d2bf;
}

.floor-panel__availability-track {
  height: 3px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
}

.floor-panel__availability-progress {
  display: block;
  height: 100%;
  background: #6f8f75;
}

.apartment-details__navigation {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 20px;
}

.apartment-details__navigation-button {
  padding: 11px 12px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.035);
  color: #b8c0ba;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.apartment-details__navigation-button:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.28);
  color: #ffffff;
}

.apartment-details__navigation-button:disabled {
  cursor: default;
  opacity: 0.3;
}

@media (prefers-reduced-motion: reduce) {
  .panel-content-forward-enter-active,
  .panel-content-forward-leave-active,
  .panel-content-back-enter-active,
  .panel-content-back-leave-active {
    transition: none;
  }
}

@media (max-width: 767px) {
  .floor-panel {
    top: auto;
    right: 16px;
    bottom: 16px;
    left: 16px;
    width: auto;
    max-height: 70vh;
    border: 1px solid rgba(255, 255, 255, 0.16);
  }
}
</style>
