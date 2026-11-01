<script setup>
import PresentationFloorSelector from './PresentationFloorSelector.vue'
import PresentationApartmentSearch from './PresentationApartmentSearch.vue'
import StatusLegend from './StatusLegend.vue'

defineProps({
  selectedFloor: {
    type: Object,
    default: null,
  },
})

defineEmits(['select-floor', 'select-apartment', 'filter-results', 'clear-filter-results'])
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
      <PresentationApartmentSearch
        @select-apartment="$emit('select-apartment', $event)"
        @filter-results="$emit('filter-results', $event)"
        @clear-filter-results="$emit('clear-filter-results')"
      />

      <StatusLegend />
    </div>
  </div>
</template>
<style scoped>
.scene-toolbar {
  position: relative;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 56px;
  padding: 8px 16px;
  border-bottom: 1px solid #ebe7de;
  background: #ffffff;
}

.scene-toolbar__left,
.scene-toolbar__right {
  display: flex;
  align-items: center;
}

.scene-toolbar__left {
  gap: 20px;
  min-width: 0;
}

.scene-toolbar__right {
  gap: 16px;
  flex-shrink: 0;
}

.scene-toolbar__mode {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.scene-toolbar__mode > div {
  display: grid;
  gap: 1px;
}

.scene-toolbar__mode strong {
  color: #30342d;
  font-size: 10px;
  font-weight: 600;
  line-height: 1.2;
}

.scene-toolbar__mode span:last-child {
  color: #969990;
  font-size: 8px;
  line-height: 1.2;
  white-space: nowrap;
}

.scene-toolbar__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 7px;
  background: #f3f1eb;
  color: #708066;
  font-size: 13px;
}

@media (max-width: 1199px) {
  .scene-toolbar__left {
    gap: 14px;
  }

  .scene-toolbar__right {
    gap: 12px;
  }

  .scene-toolbar__mode span:last-child {
    display: none;
  }
}

@media (max-width: 991px) {
  .scene-toolbar__left,
  .scene-toolbar__right {
    width: 100%;
    justify-content: space-between;
  }

  .scene-toolbar__right {
    padding-top: 8px;
    border-top: 1px solid #f0ede6;
  }
}

@media (max-width: 767px) {
  .scene-toolbar {
    gap: 10px;
    min-height: auto;
    padding: 10px 12px;
  }

  .scene-toolbar__mode {
    display: none;
  }

  .scene-toolbar__left {
    overflow-x: auto;
  }
}
</style>
