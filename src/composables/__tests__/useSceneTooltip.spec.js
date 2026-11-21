import { describe, expect, it } from 'vitest'
import { createBuildingMesh } from '../../utils/createBuildingMesh'
import { useSceneTooltip } from '../useSceneTooltip'

describe('useSceneTooltip floor availability', () => {
  it('shows availability for a floor mesh without stored counts', () => {
    const building = createBuildingMesh({
      buildingData: {
        id: 'building-a',
        name: 'Budynek A',
        floors: [
          {
            floorNumber: 1,
            apartments: [{ status: 'available' }, { status: 'reserved' }, { status: 'sold' }],
          },
        ],
      },
      buildingWidth: 3.6,
      buildingDepth: 2.4,
      floorHeight: 0.7,
      floorGap: 0.06,
    })
    const floor = building.children.find((object) => object.userData.type === 'floor')
    const { tooltip, showTooltip } = useSceneTooltip()

    expect(floor.userData).not.toHaveProperty('apartmentCount')
    expect(floor.userData).not.toHaveProperty('availableApartments')

    showTooltip(floor, { clientX: 100, clientY: 80 }, { left: 0, top: 0 })

    expect(tooltip.value.description).toBe('1 z 3 dostępnych')
  })

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
