export const sceneConfig = {
  interaction: {
    dragThreshold: 6,
  },

  camera: {
    focusDistance: 9.5,
    animationSpeed: 0.055,
    animationThreshold: 0.02,

    defaultPosition: {
      x: 6,
      y: 5,
      z: 8,
    },

    defaultTarget: {
      x: 0,
      y: 1.5,
      z: 0,
    },
  },

  apartments: {
    unmatchedOpacity: 0.18,
    unselectedOpacity: 0.4,
    revealSpeed: 0.045,
    selectedEmissiveColor: 0x5a4936,
    selectedEmissiveIntensity: 0.8,
  },

  building: {
    floorHeight: 0.7,
    floorGap: 0.06,
    width: 3.6,
    depth: 2.4,
  },
}
