<script setup>
import { computed, ref } from 'vue'
import { buildings } from '../../data/buildings'

const emit = defineEmits(['select-apartment'])

const isOpen = ref(false)
const showResults = ref(false)

const selectedRooms = ref([])
const selectedStatuses = ref([])

const minArea = ref('')
const maxArea = ref('')

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

    const matchesMinArea = !minArea.value || apartment.area >= Number(minArea.value)

    const matchesMaxArea = !maxArea.value || apartment.area <= Number(maxArea.value)

    return matchesRooms && matchesStatus && matchesMinArea && matchesMaxArea
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

const handleSubmit = () => {
  showResults.value = true
}

const handleApartmentSelect = (apartment) => {
  emit('select-apartment', apartment)

  isOpen.value = false
  showResults.value = false
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
          <span class="apartment-search__label"> Powierzchnia </span>

          <div class="apartment-search__range">
            <label>
              <span>Od</span>

              <div>
                <input v-model="minArea" type="number" min="0" placeholder="30" />

                <span>m²</span>
              </div>
            </label>

            <label>
              <span>Do</span>

              <div>
                <input v-model="maxArea" type="number" min="0" placeholder="80" />

                <span>m²</span>
              </div>
            </label>
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

        <button type="button" class="apartment-search__submit" @click="handleSubmit">
          Pokaż mieszkania
          <span>→</span>
        </button>

        <div v-if="showResults" class="apartment-search__apartments">
          <span class="apartment-search__apartments-title"> Pasujące mieszkania </span>

          <div v-if="filteredApartments.length" class="apartment-search__apartments-list">
            <button
              v-for="apartment in filteredApartments"
              :key="apartment.id"
              type="button"
              class="apartment-search__apartment"
              :disabled="apartment.status === 'sold'"
              @click="handleApartmentSelect(apartment)"
            >
              <div>
                <strong>{{ apartment.number }}</strong>

                <span>
                  {{ apartment.rooms }}
                  {{ apartment.rooms === 1 ? 'pokój' : 'pokoje' }}
                  ·
                  {{ apartment.area }} m²
                </span>
              </div>

              <span class="apartment-search__floor">
                {{ apartment.floorNumber === 0 ? 'Parter' : `Piętro ${apartment.floorNumber}` }}
              </span>
            </button>
          </div>

          <p v-else class="apartment-search__empty">
            Brak mieszkań spełniających wybrane kryteria.
          </p>
        </div>
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
  margin-top: 7px;
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

.apartment-search__apartments {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #ebe7df;
}

.apartment-search__apartments-title {
  display: block;
  margin-bottom: 10px;
  color: #83877e;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.apartment-search__apartments-list {
  display: grid;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
}

.apartment-search__apartment {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 10px 11px;
  border: 1px solid #e7e3da;
  border-radius: 8px;
  background: #ffffff;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.apartment-search__apartment:hover:not(:disabled) {
  border-color: #aeb9a6;
  background: #f7f9f5;
}

.apartment-search__apartment:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.apartment-search__apartment strong {
  display: block;
  margin-bottom: 3px;
  color: #343931;
  font-size: 11px;
}

.apartment-search__apartment div span {
  color: #8a8e85;
  font-size: 9px;
}

.apartment-search__floor {
  flex-shrink: 0;
  color: #697263;
  font-size: 8px;
}

.apartment-search__empty {
  margin: 0;
  color: #8a8e85;
  font-size: 10px;
  line-height: 1.5;
}

.apartment-search__range {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.apartment-search__range label {
  display: grid;
  gap: 5px;
}

.apartment-search__range label > span {
  color: #9a9d95;
  font-size: 8px;
}

.apartment-search__range label > div {
  display: flex;
  align-items: center;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #e4e1d9;
  border-radius: 8px;
  background: #ffffff;
}

.apartment-search__range input {
  min-width: 0;
  width: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #41463d;
  font: inherit;
  font-size: 10px;
}

.apartment-search__range label > div > span {
  flex-shrink: 0;
  color: #989c93;
  font-size: 8px;
}
</style>
