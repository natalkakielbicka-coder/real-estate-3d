import { describe, expect, it } from 'vitest'
import { useSceneTooltip } from '../useSceneTooltip'

describe('useSceneTooltip floor availability', () => {
  it.each([
    {
      name: 'a floor with mixed apartment statuses',
      statuses: ['available', 'reserved', 'available', 'sold'],
      description: '2 z 4 dostępnych',
    },
    {
      name: 'an empty floor',
      statuses: [],
      description: '0 z 0 dostępnych',
    },
  ])('calculates availability for $name from the apartment list', ({ statuses, description }) => {
    const { tooltip, showTooltip } = useSceneTooltip()
    const floor = {
      userData: {
        type: 'floor',
        floorNumber: 1,
        apartments: statuses.map((status) => ({ status })),
        availableApartments: 1,
        apartmentCount: 10,
      },
    }

    showTooltip(floor, { clientX: 100, clientY: 80 }, { left: 0, top: 0 })

    expect(tooltip.value).toMatchObject({
      visible: true,
      type: 'floor',
      description,
    })
  })
})
