<script setup>
import { apartmentStatuses } from '../../constants/apartmentStatuses'

const legendItems = Object.entries(apartmentStatuses).map(([status, config]) => ({
  status,
  label: config.label,
  color: config.cssColor,
}))
</script>

<template>
  <ul class="status-legend" aria-label="Legenda statusów mieszkań">
    <li
      v-for="item in legendItems"
      :key="item.status"
      class="status-legend__item"
      :data-status="item.status"
    >
      <i class="status-legend__dot" :style="{ background: item.color }" aria-hidden="true"></i>
      {{ item.label }}
    </li>
  </ul>
</template>

<style scoped>
.status-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.status-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #777b72;
  font-size: 8px;
  line-height: 1;
  white-space: nowrap;
}

.status-legend__dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
}

@media (max-width: 767px) {
  .status-legend {
    gap: 10px;
  }

  .status-legend__item {
    font-size: 0;
  }

  .status-legend__dot {
    width: 8px;
    height: 8px;
  }
}
</style>
