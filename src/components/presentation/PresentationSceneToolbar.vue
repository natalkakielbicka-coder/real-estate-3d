<script setup>
defineEmits(['reset'])
</script>

<template>
  <div class="scene-toolbar">
    <div class="scene-toolbar__mode">
      <span class="scene-toolbar__icon">◇</span>
      <span>Interaktywny model</span>
    </div>

    <div class="scene-toolbar__actions">
      <button type="button" class="scene-toolbar__reset" @click="$emit('reset')">
        <span>↻</span>
        Resetuj widok
      </button>

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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 64px;
  padding: 10px 18px;
  border-bottom: 1px solid #ebe7de;
  background: rgba(255, 255, 255, 0.96);
}

.scene-toolbar__mode {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #30342d;
  font-size: 12px;
  font-weight: 600;
}

.scene-toolbar__icon {
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid #e0ddd5;
  border-radius: 7px;
  background: #f7f4ee;
  color: #6b765f;
  font-size: 15px;
}

.scene-toolbar__actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.scene-toolbar__reset {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  border: 1px solid #dfdcd4;
  border-radius: 8px;
  background: #ffffff;
  color: #555950;
  font: inherit;
  font-size: 10px;
  cursor: pointer;
}

.scene-toolbar__reset span {
  font-size: 14px;
}

.scene-toolbar__reset:hover {
  border-color: #c8c3b8;
  color: #262922;
}

.scene-toolbar__legend {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 9px 12px;
  border: 1px solid #e6e2d9;
  border-radius: 8px;
  background: #faf9f6;
}

.scene-toolbar__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #72766d;
  font-size: 9px;
}

.scene-toolbar__dot {
  width: 8px;
  height: 8px;
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
    align-items: flex-start;
    padding: 12px;
  }

  .scene-toolbar__actions {
    gap: 8px;
  }

  .scene-toolbar__legend {
    display: none;
  }
}
</style>
