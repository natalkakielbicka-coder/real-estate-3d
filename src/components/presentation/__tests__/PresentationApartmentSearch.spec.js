import { afterEach, expect, it } from 'vitest'
import { enableAutoUnmount, mount } from '@vue/test-utils'
import PresentationApartmentSearch from '../PresentationApartmentSearch.vue'

enableAutoUnmount(afterEach)

it('clears previous search results when the price range becomes invalid', async () => {
  const wrapper = mount(PresentationApartmentSearch)

  await wrapper.get('.apartment-search__trigger').trigger('click')

  const submit = wrapper.get('.apartment-search__submit')
  await submit.trigger('click')

  expect(wrapper.emitted('filter-results')).toHaveLength(1)
  expect(wrapper.find('.apartment-search__apartments').exists()).toBe(true)
  expect(wrapper.emitted('clear-filter-results')).toBeUndefined()

  await wrapper.get('input[placeholder="400000"]').setValue('800000')
  await wrapper.get('input[placeholder="800000"]').setValue('400000')

  expect(wrapper.get('[role="alert"]').text()).toContain('Minimalna cena')
  expect(submit.element.disabled).toBe(true)
  expect(wrapper.find('.apartment-search__apartments').exists()).toBe(false)
  expect(wrapper.emitted('clear-filter-results')).toHaveLength(1)

  await wrapper.get('input[placeholder="800000"]').setValue('900000')

  expect(submit.element.disabled).toBe(false)
  expect(wrapper.find('.apartment-search__apartments').exists()).toBe(false)
  expect(wrapper.emitted('filter-results')).toHaveLength(1)
})
