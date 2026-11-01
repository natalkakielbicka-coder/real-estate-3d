<script setup>
import { computed } from 'vue'
import { buildings } from '../../data/buildings'
import { countApartmentsByStatus } from '../../utils/countApartmentsByStatus'
import { formatFloorLabel } from '../../utils/apartmentFormatters'

defineProps({
  selectedFloor: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-floor'])

const floors = computed(() => {
  return [...buildings[0].floors]
    .sort((a, b) => a.floorNumber - b.floorNumber)
    .map((floor) => ({
      ...floor,
      availableCount: countApartmentsByStatus(floor.apartments).available,
    }))
})

const getFloorLabel = (floorNumber) => {
  return floorNumber === 0 ? 'Parter' : floorNumber
}

const getFloorAriaLabel = (floor) => {
  return `${formatFloorLabel(floor.floorNumber)}: ${floor.availableCount} z ${floor.apartments.length} dostępnych`
}
</script>

<template>
  <div class="floor-selector">
    <span class="floor-selector__label">Piętro</span>

    <div class="floor-selector__list">
      <button
        v-for="floor in floors"
        :key="floor.floorNumber"
        type="button"
        class="floor-selector__item"
        :class="{
          'floor-selector__item--active': selectedFloor?.floorNumber === floor.floorNumber,
        }"
        :aria-label="getFloorAriaLabel(floor)"
        :title="getFloorAriaLabel(floor)"
        @click="emit('select-floor', floor.floorNumber)"
      >
        {{ getFloorLabel(floor.floorNumber) }}
        <span class="floor-selector__count" aria-hidden="true">{{ floor.availableCount }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.floor-selector {
  display: flex;
  align-items: center;
  gap: 9px;
}

.floor-selector__label {
  color: #8a8e85;
  font-size: 9px;
  white-space: nowrap;
}

.floor-selector__list {
  display: flex;
  align-items: center;
  gap: 3px;
}

.floor-selector__item {
  min-width: 32px;
  height: 30px;
  padding: 0 9px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #72776d;
  font: inherit;
  font-size: 9px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.floor-selector__item:hover {
  background: #f1f3ee;
  color: #34452f;
}

.floor-selector__item--active {
  background: #34452f;
  color: #ffffff;
  font-weight: 600;
}

.floor-selector__count {
  min-width: 14px;
  padding: 1px 4px;
  border-radius: 999px;
  background: #edf4eb;
  color: #557052;
  font-size: 8px;
  font-weight: 600;
  line-height: 1.3;
}

.floor-selector__item--active .floor-selector__count {
  background: rgba(255, 255, 255, 0.18);
  color: #ffffff;
}

.floor-selector__item:focus-visible {
  outline: 2px solid #9caa88;
  outline-offset: 1px;
}
</style>
