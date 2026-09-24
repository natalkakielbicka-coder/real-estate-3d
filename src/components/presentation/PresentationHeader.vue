<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <header class="presentation-header">
    <RouterLink to="/" class="presentation-header__brand">
      <span class="presentation-header__brand-mark"></span>

      <span class="presentation-header__brand-text">
        <strong>Real Estate</strong>
        <small>Interactive presentation</small>
      </span>
    </RouterLink>

    <nav class="presentation-header__nav" aria-label="Główna nawigacja">
      <RouterLink to="/">Inwestycja</RouterLink>
      <span>Mieszkania</span>
      <span>Lokalizacja</span>
      <span>Galeria</span>
      <RouterLink to="/prezentacja-3d" class="presentation-header__nav-active">
        Prezentacja 3D
      </RouterLink>
    </nav>

    <button type="button" class="presentation-header__contact">
      Skontaktuj się
      <span>→</span>
    </button>
  </header>
</template>

<style scoped>
.presentation-header {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  height: 72px;
  padding: 0 40px;
  border-bottom: 1px solid #ece9e2;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(16px);
}
.presentation-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  justify-self: start;
  color: #252820;
  text-decoration: none;
}
.presentation-header__brand-mark {
  position: relative;
  width: 30px;
  height: 38px;
  border: 1px solid #8c9c78;
  border-radius: 100% 0 100% 0;
  transform: rotate(-15deg);
}
.presentation-header__brand-mark::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 50%;
  width: 1px;
  height: 30px;
  background: #8c9c78;
  transform: rotate(25deg);
  transform-origin: bottom;
}
.presentation-header__brand-text {
  display: grid;
  gap: 2px;
}
.presentation-header__brand-text strong {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: 0.04em;
}
.presentation-header__brand-text small {
  color: #8e9189;
  font-size: 8px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.presentation-header__nav {
  display: flex;
  align-items: center;
  gap: 32px;
  height: 100%;
}
.presentation-header__nav a,
.presentation-header__nav span {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 100%;
  color: #555950;
  font-size: 12px;
  text-decoration: none;
}
.presentation-header__nav-active {
  color: #20251e !important;
  font-weight: 600;
}
.presentation-header__nav-active::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  background: #b8a071;
}
.presentation-header__contact {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  justify-self: end;
  padding: 12px 18px;
  border: 0;
  border-radius: 8px;
  background: #34452f;
  color: #ffffff;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.presentation-header__contact span {
  font-size: 17px;
}
@media (max-width: 991px) {
  .presentation-header {
    grid-template-columns: 1fr auto;
    padding: 0 24px;
  }
  .presentation-header__nav {
    display: none;
  }
}
@media (max-width: 575px) {
  .presentation-header {
    height: 64px;
    padding: 0 16px;
  }
  .presentation-header__brand-text small {
    display: none;
  }
  .presentation-header__contact {
    padding: 10px 12px;
  }
}
</style>
