<script setup>
import { computed } from 'vue'
import { buildings } from '../../data/buildings'

const props = defineProps({
  selectedFloor: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['select-floor'])

const floors = computed(() => {
  return [...buildings[0].floors].sort((a, b) => a.floorNumber - b.floorNumber)
})

const getFloorLabel = (floorNumber) => {
  return floorNumber === 0 ? 'Parter' : floorNumber
}
</script>

<template>
  <div class="floor-selector">
    <span class="floor-selector__label"> Wybierz piętro </span>

    <div class="floor-selector__list">
      <button
        v-for="floor in floors"
        :key="floor.floorNumber"
        type="button"
        class="floor-selector__item"
        :class="{
          'floor-selector__item--active': selectedFloor?.floorNumber === floor.floorNumber,
        }"
        @click="emit('select-floor', floor.floorNumber)"
      >
        {{ getFloorLabel(floor.floorNumber) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.floor-selector {
  position: absolute;
  top: 82px;
  left: 20px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 14px;
}

.floor-selector__label {
  color: #7f837a;
  font-size: 10px;
  font-weight: 500;
}

.floor-selector__list {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border: 1px solid #e4e0d7;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 8px 24px rgba(68, 59, 44, 0.08);
  backdrop-filter: blur(12px);
}

.floor-selector__item {
  min-width: 38px;
  height: 34px;
  padding: 0 11px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: #747970;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.floor-selector__item:hover {
  background: #f3f4f0;
  color: #30352d;
}

.floor-selector__item--active {
  background: #34452f;
  box-shadow: 0 4px 10px rgba(52, 69, 47, 0.16);
  color: #ffffff;
  font-weight: 600;
}

.floor-selector__item:focus-visible {
  outline: 2px solid #9caa88;
  outline-offset: 2px;
}

@media (max-width: 767px) {
  .floor-selector {
    top: 70px;
    right: 12px;
    left: 12px;
    gap: 8px;
  }

  .floor-selector__label {
    display: none;
  }

  .floor-selector__list {
    width: 100%;
  }

  .floor-selector__item {
    flex: 1;
  }
}
</style>
