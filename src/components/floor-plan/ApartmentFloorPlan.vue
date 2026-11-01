<script setup>
import { computed, ref, watch } from 'vue'
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

  return layout.value.rooms.map((room) => {
    const details = roomDetails.value.get(room.id)

    return {
      ...room,
      name: details?.name ?? room.id,
      area: details?.area ?? null,
      labelX: room.x + room.width / 2,
      labelY: room.y + room.height / 2,
      fontSize: Math.min(22, Math.max(12, Math.min(room.width / 14, room.height / 6))),
    }
  })
})

const formatArea = (area) => {
  if (area == null) return ''

  return `${area.toLocaleString('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} m²`
}

const viewBox = computed(() => {
  if (!layout.value) return '0 0 1000 700'

  return `0 0 ${layout.value.width} ${layout.value.height}`
})

const openings = computed(() => layout.value?.openings ?? [])

const hoveredRoomId = ref(null)

const selectedRoomId = ref(null)

const selectedRoom = computed(() => {
  return rooms.value.find((room) => room.id === selectedRoomId.value) ?? null
})

const handleRoomSelect = (room) => {
  selectedRoomId.value = selectedRoomId.value === room.id ? null : room.id
}

const emit = defineEmits(['room-hover'])

const handleRoomHover = (room) => {
  hoveredRoomId.value = room.id
  emit('room-hover', room)
}

const handleRoomLeave = () => {
  hoveredRoomId.value = null
  emit('room-hover', null)
}

watch(
  () => props.apartment.id,
  () => {
    selectedRoomId.value = null
    hoveredRoomId.value = null
  },
)
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
        <defs>
          <mask id="floor-plan-wall-mask" maskUnits="userSpaceOnUse">
            <rect
              x="-20"
              y="-20"
              :width="layout.width + 40"
              :height="layout.height + 40"
              fill="white"
            />

            <line
              v-for="opening in openings"
              :key="opening.id"
              :x1="opening.x1"
              :y1="opening.y1"
              :x2="opening.x2"
              :y2="opening.y2"
              stroke="black"
              stroke-width="22"
            />
          </mask>
        </defs>

        <!-- Kolorowe powierzchnie pomieszczeń -->

        <g
          v-for="room in rooms"
          :key="room.id"
          class="floor-plan__room"
          :class="{
            'floor-plan__room--hovered': hoveredRoomId === room.id,
            'floor-plan__room--selected': selectedRoomId === room.id,
          }"
          role="button"
          tabindex="0"
          :aria-label="`${room.name}, ${formatArea(room.area)}`"
          :aria-pressed="selectedRoomId === room.id"
          @mouseenter="handleRoomHover(room)"
          @mouseleave="handleRoomLeave"
          @click="handleRoomSelect(room)"
          @keydown.enter.prevent="handleRoomSelect(room)"
          @keydown.space.prevent="handleRoomSelect(room)"
        >
          <rect
            class="floor-plan__room-fill"
            :x="room.x"
            :y="room.y"
            :width="room.width"
            :height="room.height"
          />

          <text
            class="floor-plan__room-label"
            :x="room.labelX"
            :y="room.labelY"
            :font-size="room.fontSize"
            text-anchor="middle"
          >
            <tspan
              class="floor-plan__room-name"
              :x="room.labelX"
              :dy="room.area == null ? 0 : -room.fontSize * 0.25"
            >
              {{ room.name }}
            </tspan>

            <tspan
              v-if="room.area != null"
              class="floor-plan__room-area"
              :x="room.labelX"
              :dy="room.fontSize * 1.5"
            >
              {{ formatArea(room.area) }}
            </tspan>
          </text>
        </g>

        <!-- Ściany działowe i zewnętrzne -->
        <g mask="url(#floor-plan-wall-mask)">
          <rect
            v-for="room in rooms"
            :key="room.id"
            class="floor-plan__internal-wall"
            :x="room.x"
            :y="room.y"
            :width="room.width"
            :height="room.height"
          />

          <rect
            class="floor-plan__external-wall"
            x="0"
            y="0"
            :width="layout.width"
            :height="layout.height"
          />
        </g>
      </svg>

      <Transition name="room-details">
        <div v-if="selectedRoom" class="floor-plan__details">
          <div class="floor-plan__details-content">
            <span class="floor-plan__details-label"> Wybrane pomieszczenie </span>

            <strong class="floor-plan__details-name">
              {{ selectedRoom.name }}
            </strong>

            <span class="floor-plan__details-area">
              {{ formatArea(selectedRoom.area) }}
            </span>
          </div>

          <button
            type="button"
            class="floor-plan__details-close"
            aria-label="Odznacz pomieszczenie"
            @click="selectedRoomId = null"
          >
            ×
          </button>
        </div>
      </Transition>
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

.floor-plan__room:nth-child(even) rect {
  fill: #f0ece4;
}

.floor-plan__room-label {
  fill: #343b33;
  font-family: inherit;
  font-weight: 500;
  pointer-events: none;
}

.floor-plan__room-name {
  font-weight: 600;
}

.floor-plan__room-area {
  fill: #747e70;
  font-size: 0.85em;
  font-weight: 400;
}

.floor-plan__room-fill {
  fill: #e5ebe1;
}

.floor-plan__room:nth-child(even) .floor-plan__room-fill {
  fill: #f0ece4;
}

.floor-plan__internal-wall {
  fill: none;
  stroke: #777e72;
  stroke-width: 8;
}

.floor-plan__external-wall {
  fill: none;
  stroke: #34452f;
  stroke-width: 14;
}

.floor-plan__empty {
  padding: 2rem;
  color: #7b7f76;
  text-align: center;
}

.floor-plan__room {
  cursor: pointer;
}

.floor-plan__room-fill {
  fill: #e5ebe1;
  transition: fill 0.2s ease;
}

.floor-plan__room:nth-child(even) .floor-plan__room-fill {
  fill: #f0ece4;
}

/* Hover musi mieć wyższy priorytet */
.floor-plan__room.floor-plan__room--hovered .floor-plan__room-fill {
  fill: #b8cbb1;
}

.floor-plan__room {
  cursor: pointer;
}

/* Ściany nie mogą przechwytywać hover pomieszczeń */
.floor-plan__internal-wall,
.floor-plan__external-wall {
  pointer-events: none;
}

/* Wybrane pomieszczenie */
.floor-plan__room.floor-plan__room--selected .floor-plan__room-fill {
  fill: #91ad86;
}

/* Hover wybranego pomieszczenia */
.floor-plan__room.floor-plan__room--selected.floor-plan__room--hovered .floor-plan__room-fill {
  fill: #83a078;
}

/* Obsługa klawiatury */
.floor-plan__room:focus-visible {
  outline: none;
}

.floor-plan__room:focus-visible .floor-plan__room-fill {
  stroke: #34452f;
  stroke-width: 6;
}

/* Panel szczegółów */
.floor-plan__details {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-top: 1.25rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #d8e2d3;
  border-radius: 0.875rem;
  background: #eef3eb;
}

.floor-plan__details-content {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.floor-plan__details-label {
  color: #798b73;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.floor-plan__details-name {
  color: #34452f;
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  font-weight: 600;
}

.floor-plan__details-area {
  color: #657d62;
  font-size: 0.875rem;
}

.floor-plan__details-close {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #d8e2d3;
  border-radius: 50%;
  background: white;
  color: #34452f;
  font-size: 1.25rem;
  cursor: pointer;
}

.floor-plan__details-close:hover {
  background: #dce8d7;
}

.room-details-enter-active,
.room-details-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.room-details-enter-from,
.room-details-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
