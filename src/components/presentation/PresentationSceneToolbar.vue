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

.scene-toolbar__legend {
  display: flex;
  align-items: center;
  gap: 12px;
}

.scene-toolbar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #777b72;
  font-size: 8px;
  line-height: 1;
  white-space: nowrap;
}

.scene-toolbar__dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
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

@media (max-width: 1199px) {
  .scene-toolbar {
    gap: 16px;
  }

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
  .scene-toolbar {
    flex-wrap: wrap;
  }

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

  .scene-toolbar__legend {
    gap: 10px;
  }

  .scene-toolbar__legend-item {
    font-size: 0;
  }

  .scene-toolbar__dot {
    width: 8px;
    height: 8px;
  }
}
</style>
