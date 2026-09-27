<script setup>
defineProps({
  tooltip: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div
    v-if="tooltip.visible"
    class="scene-tooltip"
    :style="{
      left: `${tooltip.x}px`,
      top: `${tooltip.y}px`,
    }"
  >
    <template v-if="tooltip.type === 'apartment'">
      <div class="scene-tooltip__header">
        <strong>
          {{ tooltip.title }}
        </strong>

        <span
          class="scene-tooltip__status"
          :class="`scene-tooltip__status--${tooltip.status}`"
        ></span>
      </div>

      <span>
        Powierzchnia <strong>{{ tooltip.area }}</strong>
      </span>

      <span>
        Piętro <strong>{{ tooltip.floor }}</strong>
      </span>

      <span>
        Pokoje <strong>{{ tooltip.rooms }}</strong>
      </span>

      <span>
        Cena <strong>{{ tooltip.price }}</strong>
      </span>
    </template>

    <template v-else>
      <strong>
        {{ tooltip.title }}
      </strong>

      <span>
        {{ tooltip.description }}
      </span>
    </template>
  </div>
</template>

<style scoped>
.scene-tooltip {
  position: absolute;
  z-index: 30;
  display: grid;
  gap: 2px;
  min-width: 118px;
  padding: 14px 16px;
  pointer-events: none;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow:
    0 8px 28px rgba(0, 0, 0, 0.16),
    0 2px 8px rgba(0, 0, 0, 0.08);
  transform: translate(-100%, -50%);
  color: #151515;
}

.scene-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 64px;
  height: 2px;
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%);
}

.scene-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(100% + 64px);
  width: 10px;
  height: 10px;
  border: 2px solid rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  background: #ffffff;
  transform: translate(-50%, -50%);
}

.scene-tooltip__header {
  display: flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 6px;
}

.scene-tooltip__header strong {
  font-size: 14px;
  font-weight: 700;
}

.scene-tooltip > span {
  font-size: 11px;
  line-height: 1.25;
  color: #242424;
}

.scene-tooltip > span strong {
  font-weight: 600;
}

.scene-tooltip__status {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
  border-radius: 50%;
}

.scene-tooltip__status--available {
  background: var(--status-available);
}

.scene-tooltip__status--reserved {
  background: var(--status-reserved);
}

.scene-tooltip__status--sold {
  background: var(--status-sold);
}
</style>
