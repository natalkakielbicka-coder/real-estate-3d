import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusLegend from '../StatusLegend.vue'
import { apartmentStatuses } from '../../../constants/apartmentStatuses'

describe('StatusLegend', () => {
  it('renders one item per apartment status', () => {
    const wrapper = mount(StatusLegend)

    expect(wrapper.findAll('li')).toHaveLength(Object.keys(apartmentStatuses).length)
  })

  it('shows status labels and colors from apartmentStatuses', () => {
    const wrapper = mount(StatusLegend)

    Object.entries(apartmentStatuses).forEach(([status, config]) => {
      const item = wrapper.find(`[data-status="${status}"]`)

      expect(item.text()).toBe(config.label)
      expect(item.find('i').attributes('style')).toContain('background')
    })
  })
})
