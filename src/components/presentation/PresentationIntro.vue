<script setup>
defineEmits(['reset'])
</script>

<template>
  <section class="presentation-intro">
    <div class="presentation-intro__content">
      <span class="presentation-intro__eyebrow">Odkryj swoją przestrzeń</span>
      <h1>Prezentacja 3D</h1>
      <p>
        Zobacz inwestycję z każdej strony i wybierz wymarzone mieszkanie na interaktywnym modelu
        osiedla.
      </p>
    </div>

    <div class="presentation-intro__aside">
      <span class="presentation-intro__accent">
        Więcej
        <br />
        niż mieszkanie
      </span>

      <button type="button" class="presentation-intro__reset" @click="$emit('reset')">
        <span>↻</span>
        Resetuj widok
      </button>
    </div>
  </section>
</template>

<style scoped>
.presentation-intro {
  position: absolute;
  top: 72px;
  right: 0;
  left: 0;
  z-index: 12;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: end;
  gap: 48px;
  min-height: 220px;
  padding: 38px 48px 32px;
  border-bottom: 1px solid #ebe7de;
  background: #f7f4ee;
}

.presentation-intro__content {
  max-width: 680px;
}

.presentation-intro__eyebrow {
  display: block;
  margin-bottom: 12px;
  color: #9f8b68;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.presentation-intro h1 {
  margin: 0;
  color: #24251f;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.8rem, 4vw, 4.4rem);
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.035em;
}

.presentation-intro p {
  max-width: 560px;
  margin: 20px 0 0;
  color: #74776f;
  font-size: 14px;
  line-height: 1.7;
}

.presentation-intro__aside {
  display: flex;
  align-items: flex-end;
  gap: 36px;
}

.presentation-intro__accent {
  color: #b59a70;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 25px;
  font-style: italic;
  line-height: 1.05;
  text-align: right;
  transform: rotate(-5deg);
}

.presentation-intro__reset {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 15px;
  border: 1px solid #dedad1;
  border-radius: 9px;
  background: #ffffff;
  box-shadow: 0 6px 20px rgba(57, 51, 41, 0.06);
  color: #4e514a;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.presentation-intro__reset span {
  font-size: 16px;
}

.presentation-intro__reset:hover {
  border-color: #c9c2b5;
  color: #24251f;
}

@media (max-width: 767px) {
  .presentation-intro {
    top: 64px;
    grid-template-columns: 1fr;
    gap: 22px;
    min-height: 230px;
    padding: 28px 24px;
  }

  .presentation-intro__aside {
    align-items: center;
    justify-content: space-between;
  }

  .presentation-intro__accent {
    font-size: 19px;
  }
}
</style>
