const createRoom = (id, x, y, width, height) => ({
  id,
  x,
  y,
  width,
  height,
})

export const floorPlanLayouts = {
  studio: {
    width: 1000,
    height: 700,
    rooms: [
      createRoom('living-room', 0, 0, 700, 550),
      createRoom('kitchen', 700, 0, 300, 350),
      createRoom('bathroom', 700, 350, 300, 350),
      createRoom('hall', 0, 550, 700, 150),
    ],
  },

  twoRooms: {
    width: 1000,
    height: 700,
    rooms: [
      createRoom('living-room', 0, 0, 600, 450),
      createRoom('bedroom', 600, 0, 400, 450),
      createRoom('bathroom', 600, 450, 400, 250),
      createRoom('hall', 0, 450, 600, 250),
    ],
  },

  threeRooms: {
    width: 1000,
    height: 700,
    rooms: [
      createRoom('living-room', 0, 0, 600, 400),
      createRoom('bedroom', 600, 0, 400, 300),
      createRoom('second-bedroom', 600, 300, 400, 250),
      createRoom('bathroom', 600, 550, 400, 150),
      createRoom('hall', 0, 400, 600, 300),
    ],
  },
}

export const getFloorPlanLayout = (type) => {
  return floorPlanLayouts[type] ?? null
}
