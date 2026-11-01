const createRoom = (id, x, y, width, height) => ({
  id,
  x,
  y,
  width,
  height,
})

const createOpening = (id, x1, y1, x2, y2, type) => ({
  id,
  x1,
  y1,
  x2,
  y2,
  type,
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
    openings: [
      createOpening('entrance', 100, 700, 230, 700, 'door'),
      createOpening('living-door', 280, 550, 400, 550, 'door'),
      createOpening('kitchen-door', 700, 120, 700, 250, 'door'),
      createOpening('bathroom-door', 700, 570, 700, 670, 'door'),
      createOpening('living-window', 200, 0, 430, 0, 'window'),
      createOpening('kitchen-window', 790, 0, 920, 0, 'window'),
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
    openings: [
      createOpening('entrance', 100, 700, 230, 700, 'door'),
      createOpening('living-door', 250, 450, 380, 450, 'door'),
      createOpening('bedroom-door', 600, 180, 600, 300, 'door'),
      createOpening('bathroom-door', 600, 520, 600, 630, 'door'),
      createOpening('living-window', 180, 0, 400, 0, 'window'),
      createOpening('bedroom-window', 720, 0, 900, 0, 'window'),
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
    openings: [
      createOpening('entrance', 100, 700, 230, 700, 'door'),
      createOpening('living-door', 250, 400, 380, 400, 'door'),
      createOpening('bedroom-door', 600, 120, 600, 240, 'door'),
      createOpening('second-bedroom-door', 740, 300, 860, 300, 'door'),
      createOpening('bathroom-door', 600, 570, 600, 670, 'door'),
      createOpening('living-window', 180, 0, 400, 0, 'window'),
      createOpening('bedroom-window', 720, 0, 900, 0, 'window'),
    ],
  },
}

export const getFloorPlanLayout = (type) => {
  return floorPlanLayouts[type] ?? null
}
