<script setup>
import { computed, ref } from 'vue'
import { buildings } from '../../data/buildings'

const isOpen = ref(false)

const selectedRooms = ref([])
const selectedStatuses = ref([])

const roomOptions = [1, 2, 3, 4]
const statusOptions = [
  {
    value: 'available',
    label: 'Dostępne',
  },
  {
    value: 'reserved',
    label: 'Zarezerwowane',
  },
]

const apartments = computed(() => {
  return buildings.flatMap((building) =>
    building.floors.flatMap((floor) =>
      floor.apartments.map((apartment) => ({
        ...apartment,
        floorNumber: floor.floorNumber,
        buildingId: building.id,
        buildingName: building.name,
      })),
    ),
  )
})

const filteredApartments = computed(() => {
  return apartments.value.filter((apartment) => {
    const matchesRooms =
      selectedRooms.value.length === 0 ||
      selectedRooms.value.includes(apartment.rooms >= 4 ? 4 : apartment.rooms)

    const matchesStatus =
      selectedStatuses.value.length === 0 || selectedStatuses.value.includes(apartment.status)

    return matchesRooms && matchesStatus
  })
})

const toggleRoom = (rooms) => {
  if (selectedRooms.value.includes(rooms)) {
    selectedRooms.value = selectedRooms.value.filter((item) => item !== rooms)

    return
  }

  selectedRooms.value.push(rooms)
}

const toggleStatus = (status) => {
  if (selectedStatuses.value.includes(status)) {
    selectedStatuses.value = selectedStatuses.value.filter((item) => item !== status)

    return
  }

  selectedStatuses.value.push(status)
}
</script>

<template>
  <div class="apartment-search">
    <button
      type="button"
      class="apartment-search__trigger"
      :class="{ 'apartment-search__trigger--active': isOpen }"
      @click="isOpen = !isOpen"
    >
      Znajdź mieszkanie

      <span>
        {{ isOpen ? '×' : '⌕' }}
      </span>
    </button>

    <Transition name="search-panel">
      <div v-if="isOpen" class="apartment-search__panel">
        <div class="apartment-search__heading">
          <div>
            <span>Wyszukiwarka</span>
            <strong>Znajdź mieszkanie</strong>
          </div>

          <button
            type="button"
            class="apartment-search__close"
            aria-label="Zamknij wyszukiwarkę"
            @click="isOpen = false"
          >
            ×
          </button>
        </div>

        <div class="apartment-search__section">
          <span class="apartment-search__label"> Liczba pokoi </span>

          <div class="apartment-search__options">
            <button
              v-for="rooms in roomOptions"
              :key="rooms"
              type="button"
              :class="{
                'apartment-search__option--active': selectedRooms.includes(rooms),
              }"
              @click="toggleRoom(rooms)"
            >
              {{ rooms === 4 ? '4+' : rooms }}
            </button>
          </div>
        </div>

        <div class="apartment-search__section">
          <span class="apartment-search__label"> Status </span>

          <div class="apartment-search__options apartment-search__options--wide">
            <button
              v-for="status in statusOptions"
              :key="status.value"
              type="button"
              :class="{
                'apartment-search__option--active': selectedStatuses.includes(status.value),
              }"
              @click="toggleStatus(status.value)"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <div class="apartment-search__results">
          <span>Znaleziono</span>

          <strong>
            {{ filteredApartments.length }}
            mieszkań
          </strong>
        </div>

        <button type="button" class="apartment-search__submit">
          Pokaż mieszkania
          <span>→</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.apartment-search {
  position: relative;
  z-index: 50;
}

.apartment-search__trigger {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  height: 44px;
  padding: 0 15px;
  border: 1px solid #dedbd3;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 8px 24px rgba(68, 59, 44, 0.07);
  color: #4d5248;
  font: inherit;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
}

.apartment-search__trigger:hover {
  border-color: #bec6b7;
  background: #f7f8f5;
  color: #2f352c;
}

.apartment-search__trigger:focus,
.apartment-search__trigger:focus-visible {
  outline: none;
  border-color: #899c80;
  background: #ffffff;
  color: #34452f;
}

.apartment-search__trigger--active,
.apartment-search__trigger--active:hover,
.apartment-search__trigger--active:focus {
  border-color: #899c80;
  background: #34452f;
  color: #ffffff;
}

.apartment-search__trigger span {
  font-size: 15px;
}

.apartment-search__panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 310px;
  padding: 20px;
  border: 1px solid #e4e0d7;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 20px 50px rgba(62, 54, 43, 0.14);
  backdrop-filter: blur(14px);
  z-index: 100;
}

.apartment-search__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.apartment-search__heading > div {
  display: grid;
  gap: 4px;
}

.apartment-search__heading span {
  color: #9c8b6b;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.apartment-search__heading strong {
  color: #2e312a;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 21px;
  font-weight: 400;
}

.apartment-search__close {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid #e3dfd6;
  border-radius: 50%;
  background: #f8f6f1;
  color: #6f736a;
  font: inherit;
  font-size: 17px;
  cursor: pointer;
}

.apartment-search__section + .apartment-search__section {
  margin-top: 18px;
}

.apartment-search__label {
  display: block;
  margin-bottom: 8px;
  color: #83877e;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-search__options {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
}

.apartment-search__options--wide {
  grid-template-columns: repeat(2, 1fr);
}

.apartment-search__options button {
  height: 38px;
  border: 1px solid #e4e1d9;
  border-radius: 8px;
  background: #ffffff;
  color: #696e64;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.apartment-search__options button:hover {
  border-color: #aeb9a6;
  background: #f6f8f4;
  color: #34452f;
}

.apartment-search__submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 22px;
  padding: 12px 14px;
  border: 0;
  border-radius: 9px;
  background: #34452f;
  color: #ffffff;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.apartment-search__submit span {
  font-size: 16px;
}

.search-panel-enter-active,
.search-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s ease;
}

.search-panel-enter-from,
.search-panel-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

.apartment-search__option--active {
  border-color: #899c80 !important;
  background: #eef2eb !important;
  color: #34452f !important;
  font-weight: 600;
}

.apartment-search__results {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 22px;
  padding-top: 16px;
  border-top: 1px solid #ebe7df;
}

.apartment-search__results span {
  color: #8b8f86;
  font-size: 9px;
}

.apartment-search__results strong {
  color: #34452f;
  font-size: 11px;
  font-weight: 600;
}
</style>
