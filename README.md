# Real Estate 3D

An interactive 3D presentation of a residential building, built with **Vue 3** and **Three.js**. Users can explore the building, select a floor, browse apartments and search for an apartment that matches their needs — with results highlighted directly on the 3D model.

**[Live demo](https://natalkakielbicka-coder.github.io/real-estate-3d/)**

> 🚧 This project is under active development — see the [Roadmap](#roadmap).

## Features

- Interactive 3D building model with orbit controls
- Floor selection by clicking the model or using the floor selector
- Apartments shown on the selected floor, coloured by status (available, reserved, sold)
- Smooth camera animations when focusing on a floor or apartment
- Hover highlights and tooltips with apartment details
- Sold apartments cannot be selected
- Side panel with floor overview and apartment details: area, rooms, floor, price and price per m²
- Previous / next navigation between apartments on a floor
- Apartment search with filters for rooms, status, area and price, including range validation
- Search results highlighted on the 3D model
- View reset and responsive layout

## Tech stack

- [Vue 3](https://vuejs.org/) — Composition API, `<script setup>`
- [Three.js](https://threejs.org/) — 3D scene, raycasting and camera animation
- [Vue Router](https://router.vuejs.org/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) — unit tests
- [Playwright](https://playwright.dev/) — end-to-end tests
- ESLint, Prettier
- GitHub Actions — CI and deployment to GitHub Pages

## Getting started

Requires Node.js 22.18+ or 24.12+.

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Start the development server      |
| `npm run build`        | Build for production              |
| `npm run preview`      | Preview the production build      |
| `npm run test:unit`    | Run unit tests (Vitest)           |
| `npm run test:e2e`     | Run end-to-end tests (Playwright) |
| `npm run lint`         | Lint the code                     |
| `npm run format`       | Format the code                   |
| `npm run format:check` | Check formatting                  |

## Project structure

```text
src/
├── components/
│   ├── presentation/   # UI: header, intro, toolbar, search, floor selector, side panel
│   └── three/          # 3D scene and tooltip
├── composables/        # Scene logic: camera, hover, selection, raycasting, resize
├── config/             # Scene settings
├── constants/          # Apartment statuses
├── data/               # Building and apartment data
├── utils/              # Scene builders, formatters, filtering
└── views/              # Page views
e2e/                    # Playwright tests
```

The 3D logic is split into small composables and utility functions, so `ThreeScene.vue` only connects them together. Pure logic, such as filtering and formatting, is covered by unit tests.

## Data

Apartment data is generated locally in `src/data/buildings.js` for demonstration purposes. No backend or external API is required.

## Roadmap

- [ ] Selected floor and apartment synced with the URL (shareable links)
- [ ] Status colour legend
- [ ] Apartment status counts per floor
- [ ] Live result count and sorting in search
- [ ] Favourite apartments
- [ ] Multiple buildings
- [ ] Accessibility improvements (keyboard support, reduced motion)
- [ ] Performance: render on demand, pause when the tab is hidden
- [ ] More end-to-end tests for scene interactions
