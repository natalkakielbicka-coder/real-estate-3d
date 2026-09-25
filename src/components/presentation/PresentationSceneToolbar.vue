<script setup>
import PresentationFloorSelector from './PresentationFloorSelector.vue'
import PresentationApartmentSearch from './PresentationApartmentSearch.vue'

defineProps({
  selectedFloor: {
    type: Object,
    default: null,
  },
})

defineEmits(['select-floor', 'select-apartment'])
</script>

<template>
  <div class="scene-toolbar">
    <div class="scene-toolbar__left">
      <div class="scene-toolbar__mode">
        <span class="scene-toolbar__icon">◇</span>

        <div>
          <strong>Interaktywny model</strong>
          <span>Wybierz kondygnację lub kliknij budynek</span>
        </div>
      </div>

      <PresentationFloorSelector
        :selected-floor="selectedFloor"
        @select-floor="$emit('select-floor', $event)"
      />
    </div>

    <div class="scene-toolbar__right">
      <PresentationApartmentSearch @select-apartment="$emit('select-apartment', $event)" />

      <div class="scene-toolbar__legend">
        <span class="scene-toolbar__legend-item">
          <i class="scene-toolbar__dot scene-toolbar__dot--available"></i>
          Dostępne
        </span>

        <span class="scene-toolbar__legend-item">
          <i class="scene-toolbar__dot scene-toolbar__dot--reserved"></i>
          Zarezerwowane
        </span>

        <span class="scene-toolbar__legend-item">
          <i class="scene-toolbar__dot scene-toolbar__dot--sold"></i>
          Sprzedane
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scene-toolbar__left {
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;
}

.scene-toolbar__right {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-shrink: 0;
}
.scene-toolbar__info {
  display: flex;
  align-items: center;
  gap: 11px;
}

.scene-toolbar__icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: #f3f1eb;
  color: #708066;
}

.scene-toolbar__icon svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.4;
}

.scene-toolbar__info > div {
  display: grid;
  gap: 2px;
}

.scene-toolbar__info strong {
  color: #30342d;
  font-size: 11px;
  font-weight: 600;
}

.scene-toolbar__info > div > span {
  color: #969990;
  font-size: 9px;
}

.scene-toolbar__legend {
  display: flex;
  align-items: center;
  gap: 20px;
}

.scene-toolbar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #777b72;
  font-size: 9px;
}

.scene-toolbar__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.scene-toolbar__dot--available {
  background: #6f9a70;
}

.scene-toolbar__dot--reserved {
  background: #c4a66d;
}

.scene-toolbar__dot--sold {
  background: #d17979;
}

.scene-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 68px;
  padding: 10px 18px;
  border-bottom: 1px solid #ebe7de;
  background: #ffffff;
}

.scene-toolbar__mode {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scene-toolbar__mode > div {
  display: grid;
  gap: 2px;
}

.scene-toolbar__mode strong {
  color: #30342d;
  font-size: 11px;
  font-weight: 600;
}

.scene-toolbar__mode span:last-child {
  color: #969990;
  font-size: 9px;
}

.scene-toolbar__icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f3f1eb;
  color: #708066;
}

.scene-toolbar__legend {
  display: flex;
  align-items: center;
  gap: 14px;
}

.scene-toolbar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #777b72;
  font-size: 9px;
}

.scene-toolbar__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.scene-toolbar__dot--available {
  background: #6f9a70;
}

.scene-toolbar__dot--reserved {
  background: #c4a66d;
}

.scene-toolbar__dot--sold {
  background: #d17979;
}

@media (max-width: 767px) {
  .scene-toolbar {
    min-height: 58px;
    padding: 9px 12px;
  }

  .scene-toolbar__info > div > span {
    display: none;
  }

  .scene-toolbar__legend {
    gap: 10px;
  }

  .scene-toolbar__legend-item {
    font-size: 0;
  }
}
</style>
