<template>
  <div class="scene-toolbar">
    <div class="scene-toolbar__info">
      <span class="scene-toolbar__icon">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 3 4.5 7.2v9.6L12 21l7.5-4.2V7.2L12 3Z" />
          <path d="M4.5 7.2 12 11.5l7.5-4.3" />
          <path d="M12 11.5V21" />
        </svg>
      </span>

      <div>
        <strong>Interaktywny model</strong>
        <span>Obróć model i wybierz kondygnację</span>
      </div>
    </div>

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
</template>

<style scoped>
.scene-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 64px;
  padding: 10px 20px;
  border-bottom: 1px solid #ebe7de;
  background: #ffffff;
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
