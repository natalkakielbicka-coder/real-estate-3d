<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { apartmentStatuses, apartmentStatusLabels } from '../../constants/apartmentStatuses'
import { countApartmentsByStatus } from '../../utils/countApartmentsByStatus'
import { isApartmentSelectable } from '@/utils/isApartmentSelectable'
import { getAdjacentApartments, sortApartmentsByStatus } from '../../utils/apartmentList'
import {
  getRoomsLabel,
  formatPrice,
  formatFloorLabel,
  formatPricePerSquareMeter,
} from '../../utils/apartmentFormatters'

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

const sortedApartments = computed(() => sortApartmentsByStatus(props.selectedFloor.apartments))

const adjacentApartments = computed(() =>
  getAdjacentApartments(
    props.selectedFloor.apartments.filter(isApartmentSelectable),
    props.selectedApartment?.id,
  ),
)

const previousApartment = computed(() => adjacentApartments.value.previous)
const nextApartment = computed(() => adjacentApartments.value.next)

const floorLabel = computed(() => formatFloorLabel(props.selectedFloor.floorNumber))

const statusCounts = computed(() => countApartmentsByStatus(props.selectedFloor.apartments))

const linkCopied = ref(false)
const linkCopyFailed = ref(false)
let copyFeedbackTimeout

const copyApartmentLink = async () => {
  clearTimeout(copyFeedbackTimeout)

  try {
    await navigator.clipboard.writeText(window.location.href)
    linkCopied.value = true
  } catch {
    linkCopyFailed.value = true
  }

  copyFeedbackTimeout = setTimeout(() => {
    linkCopied.value = false
    linkCopyFailed.value = false
  }, 2000)
}

onBeforeUnmount(() => clearTimeout(copyFeedbackTimeout))
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

        <div class="floor-panel__breadcrumb">
          <span>{{ selectedFloor.buildingName }}</span>
          <i>/</i>
          <span>{{ floorLabel }}</span>
        </div>

        <div class="floor-panel__heading">
          <div>
            <span class="floor-panel__label">Mieszkanie</span>

            <strong class="floor-panel__title">
              {{ selectedApartment.number }}
            </strong>
          </div>

          <span
            class="apartment-details__status"
            :class="`apartment-row__status--${selectedApartment.status}`"
          >
            <i></i>
            {{ apartmentStatusLabels[selectedApartment.status] }}
          </span>
        </div>

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
            <strong>{{ floorLabel }}</strong>
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
              {{ formatPricePerSquareMeter(selectedApartment.price, selectedApartment.area) }}
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

        <button type="button" class="apartment-details__share" @click="copyApartmentLink">
          {{
            linkCopied
              ? 'Skopiowano link ✓'
              : linkCopyFailed
                ? 'Nie udało się skopiować'
                : 'Kopiuj link do mieszkania'
          }}
        </button>
      </div>

      <!-- PIĘTRO -->
      <div
        v-else
        :key="`floor-${selectedFloor.buildingId}-${selectedFloor.floorNumber}`"
        class="floor-panel__content"
      >
        <div class="floor-panel__breadcrumb">
          <span>{{ selectedFloor.buildingName }}</span>
          <i>/</i>
          <span>Prezentacja 3D</span>
        </div>

        <div class="floor-panel__heading">
          <div>
            <span class="floor-panel__label">Wybrana kondygnacja</span>

            <strong class="floor-panel__title">
              {{ floorLabel }}
            </strong>
          </div>
        </div>

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

          <ul class="floor-panel__status-counts">
            <li
              v-for="(config, status) in apartmentStatuses"
              :key="status"
              class="floor-panel__status-count"
              :data-status="status"
            >
              <i :style="{ background: config.cssColor }" aria-hidden="true"></i>
              {{ config.label }}
              <strong>{{ statusCounts[status] }}</strong>
            </li>
          </ul>
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
              {{ floorLabel }}
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
              :disabled="!isApartmentSelectable(apartment)"
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
  top: 304px;
  right: 40px;
  bottom: 36px;
  z-index: 30;
  width: 400px;
  padding: 28px 24px;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #e2ded5;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 70px rgba(72, 62, 47, 0.14);
}

.floor-panel__close {
  position: absolute;
  top: 18px;
  right: 18px;
  width: 36px;
  height: 36px;
  border: 1px solid #e1ddd4;
  border-radius: 50%;
  background: #f8f6f1;
  color: #60645b;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.floor-panel__close:hover {
  border-color: #c9c3b7;
  background: #f2efe8;
  color: #22251f;
}

.floor-panel__close:focus-visible,
.floor-panel__back:focus-visible {
  outline: 2px solid #9caa88;
  outline-offset: 3px;
}

.floor-panel__back {
  display: inline-flex;
  align-items: center;
  margin: 0 0 28px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #7c8177;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.floor-panel__back:hover {
  color: #2f342c;
}

.floor-panel__label {
  display: block;
  margin-bottom: 10px;
  color: #9c8a6b;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.floor-panel__title {
  display: block;
  color: #272a24;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 30px;
  font-weight: 400;
  line-height: 1.1;
}

.floor-panel__description {
  margin: 12px 0 0;
  color: #7b7f76;
  font-size: 13px;
  line-height: 1.6;
}

.floor-panel__availability {
  margin-top: 22px;
  padding: 16px;
  border: 1px solid #ebe7df;
  border-radius: 12px;
  background: #faf8f4;
}

.floor-panel__availability-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 10px;
  color: #8b8f86;
  font-size: 9px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.floor-panel__availability-header strong {
  color: #657d62;
  font-size: 11px;
  font-weight: 600;
}

.floor-panel__availability-track {
  height: 4px;
  overflow: hidden;
  border-radius: 999px;
  background: #e7e4dc;
}

.floor-panel__availability-progress {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #799274;
}

.floor-panel__status-counts {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
}

.floor-panel__status-count {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #7b7f76;
  font-size: 10px;
}

.floor-panel__status-count i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.floor-panel__status-count strong {
  color: #353932;
  font-weight: 600;
}

.floor-panel__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 16px;
  padding-top: 0;
  border-top: 0;
}

.floor-panel__detail {
  min-width: 0;
  padding: 12px;
  border: 1px solid #ebe7df;
  border-radius: 10px;
  background: #faf9f6;
}

.floor-panel__detail span {
  display: block;
  margin-bottom: 6px;
  color: #989b93;
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.floor-panel__detail strong {
  display: block;
  color: #353932;
  font-size: 13px;
  font-weight: 500;
}

.floor-panel__apartments {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #ebe7df;
}

.floor-panel__apartments-title {
  display: block;
  margin-bottom: 12px;
  color: #747970;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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
  padding: 12px;
  border: 1px solid #ebe7df;
  border-radius: 11px;
  background: #ffffff;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.apartment-row:hover {
  border-color: #cacfc4;
  background: #fbfcfa;
  box-shadow: 0 8px 20px rgba(63, 70, 57, 0.06);
}

.apartment-row:focus-visible {
  outline: 2px solid #9caa88;
  outline-offset: 2px;
}

.apartment-row:disabled {
  cursor: not-allowed;
  opacity: 0.48;
}

.apartment-row:disabled:hover {
  border-color: #ebe7df;
  background: #ffffff;
  box-shadow: none;
}

.apartment-row__main {
  min-width: 0;
}

.apartment-row__main strong {
  display: block;
  margin-bottom: 3px;
  color: #30342d;
  font-size: 14px;
  font-weight: 600;
}

.apartment-row__main span {
  display: block;
  color: #8b9087;
  font-size: 10px;
}

.apartment-row__price {
  margin-top: 5px;
  color: #4f554c !important;
  font-size: 12px !important;
  font-weight: 600;
}

.apartment-row__status {
  flex-shrink: 0;
  padding: 5px 7px;
  border-radius: 999px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.apartment-row__status--available {
  color: #557052;
  background: #edf4eb;
}

.apartment-row__status--reserved {
  color: #927541;
  background: #f6f0e3;
}

.apartment-row__status--sold {
  color: #9b6464;
  background: #f7eaea;
}

.apartment-details__status {
  display: inline-block;
  margin-top: 14px;
  padding: 6px 9px;
  border-radius: 999px;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.apartment-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 24px;
  background: transparent;
}

.apartment-details__item {
  padding: 16px;
  border: 1px solid #ebe7df;
  border-radius: 11px;
  background: #faf9f6;
}

.apartment-details__item span {
  display: block;
  margin-bottom: 7px;
  color: #969a91;
  font-size: 8px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-details__item strong {
  display: block;
  color: #33372f;
  font-size: 16px;
  font-weight: 500;
}

.apartment-details__navigation {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 18px;
}

.apartment-details__navigation-button {
  padding: 11px 12px;
  border: 1px solid #dedad1;
  border-radius: 9px;
  background: #ffffff;
  color: #60655b;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.apartment-details__navigation-button:hover:not(:disabled) {
  border-color: #aeb7a5;
  background: #f7f9f5;
  color: #2e342b;
}

.apartment-details__navigation-button:disabled {
  cursor: default;
  opacity: 0.35;
}

.apartment-details__share {
  width: 100%;
  margin-top: 8px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #dedad1;
  border-radius: 9px;
  background: #faf9f6;
  color: #60655b;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.apartment-details__share:hover {
  border-color: #aeb7a5;
  color: #2e342b;
}

.apartment-details__share:focus-visible {
  outline: 2px solid #9caa88;
  outline-offset: 3px;
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

.panel-content-forward-leave-active,
.panel-content-back-leave-active {
  position: absolute;
  top: 28px;
  right: 24px;
  left: 24px;
  min-height: 0;
}

.floor-panel__breadcrumb {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 22px;
  padding-right: 48px;
  color: #92958d;
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.floor-panel__breadcrumb i {
  color: #c4bba9;
  font-style: normal;
}

.floor-panel__heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
}

.floor-panel__heading > div {
  min-width: 0;
}

.floor-panel__label {
  display: block;
  margin-bottom: 7px;
  color: #a18b67;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.floor-panel__title {
  display: block;
  color: #272a24;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 400;
  line-height: 1.05;
}

.apartment-details__status i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
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
    right: 20px;
    bottom: 24px;
    left: 20px;
    width: auto;
    max-height: 66vh;
    border-radius: 14px;
  }

  .floor-panel__details {
    grid-template-columns: repeat(3, 1fr);
  }

  .apartment-details {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
