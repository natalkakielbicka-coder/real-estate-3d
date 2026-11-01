<script setup>
import { computed } from 'vue'
import { getFloorPlanLayout } from '@/data/floorPlanLayouts'

const props = defineProps({
  apartment: {
    type: Object,
    required: true,
  },
})

const layout = computed(() => getFloorPlanLayout(props.apartment.floorPlanType))

const roomDetails = computed(() => {
  return new Map((props.apartment.roomDetails ?? []).map((room) => [room.id, room]))
})

const rooms = computed(() => {
  if (!layout.value) return []

  return layout.value.rooms.map((room) => ({
    ...room,
    name: roomDetails.value.get(room.id)?.name ?? room.id,
    area: roomDetails.value.get(room.id)?.area ?? null,
  }))
})

const viewBox = computed(() => {
  if (!layout.value) return '0 0 1000 700'

  return `0 0 ${layout.value.width} ${layout.value.height}`
})
</script>

<template>
  <div class="floor-plan">
    <div v-if="layout" class="floor-plan__canvas">
      <svg
        :viewBox="viewBox"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        :aria-label="`Rzut mieszkania ${apartment.number}`"
      >
        <g v-for="room in rooms" :key="room.id" class="floor-plan__room">
          <rect :x="room.x" :y="room.y" :width="room.width" :height="room.height" />

          <text
            :x="room.x + room.width / 2"
            :y="room.y + room.height / 2"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ room.name }}
          </text>
        </g>

        <rect
          class="floor-plan__outline"
          x="0"
          y="0"
          :width="layout.width"
          :height="layout.height"
        />
      </svg>
    </div>

    <p v-else class="floor-plan__empty">Brak rzutu dla wybranego mieszkania.</p>
  </div>
</template>

<style scoped>
.floor-plan {
  width: 100%;
}

.floor-plan__canvas {
  width: 100%;
  padding: 1.5rem;
  border: 1px solid #e2ded5;
  border-radius: 1rem;
  background: #faf8f4;
}

.floor-plan__canvas svg {
  display: block;
  width: 100%;
  height: auto;
}

.floor-plan__room rect {
  fill: #e5ebe1;
  stroke: #777e72;
  stroke-width: 4;
}

.floor-plan__room:nth-child(even) rect {
  fill: #f0ece4;
}

.floor-plan__room text {
  fill: #343b33;
  font-family: inherit;
  font-size: 22px;
  font-weight: 500;
  pointer-events: none;
}

.floor-plan__outline {
  fill: none;
  stroke: #34452f;
  stroke-width: 8;
  pointer-events: none;
}

.floor-plan__empty {
  padding: 2rem;
  color: #7b7f76;
  text-align: center;
}
</style>
