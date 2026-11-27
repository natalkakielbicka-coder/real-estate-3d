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

it('exposes the search panel state and its relationship to the toggle', async () => {
  const wrapper = mount(PresentationApartmentSearch)
  const trigger = wrapper.get('.apartment-search__trigger')
  const panel = wrapper.get('.apartment-search__panel')

  const panelId = panel.attributes('id')
  expect(panelId).toBeTruthy()
  expect(trigger.attributes('aria-controls')).toBe(panelId)
  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(panel.element.style.display).toBe('none')

  await trigger.trigger('click')

  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(panel.element.style.display).not.toBe('none')

  await trigger.trigger('click')

  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(panel.element.style.display).toBe('none')
})

it('returns focus to the search toggle when Escape closes the panel', async () => {
  const wrapper = mount(PresentationApartmentSearch, { attachTo: document.body })
  const trigger = wrapper.get('.apartment-search__trigger')

  await trigger.trigger('click')

  const priceInput = wrapper.get('input[placeholder="400000"]')
  priceInput.element.focus()
  expect(document.activeElement).toBe(priceInput.element)

  await priceInput.trigger('keydown', { key: 'Escape' })

  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger.element)
})

it('returns focus to the search toggle when the close button is clicked', async () => {
  const wrapper = mount(PresentationApartmentSearch, { attachTo: document.body })
  const trigger = wrapper.get('.apartment-search__trigger')

  await trigger.trigger('click')

  const closeButton = wrapper.get('[aria-label="Zamknij wyszukiwarkę"]')
  closeButton.element.focus()

  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(document.activeElement).toBe(closeButton.element)

  await closeButton.trigger('click')

  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger.element)
})

it('updates the pressed state when toggling and clearing search filters', async () => {
  const wrapper = mount(PresentationApartmentSearch)
  await wrapper.get('.apartment-search__trigger').trigger('click')

  const room = wrapper.get('.apartment-search__options button')
  const status = wrapper.get('.apartment-search__options--wide button')

  expect(room.attributes('aria-pressed')).toBe('false')
  expect(status.attributes('aria-pressed')).toBe('false')

  await room.trigger('click')
  await status.trigger('click')

  expect(room.attributes('aria-pressed')).toBe('true')
  expect(status.attributes('aria-pressed')).toBe('true')

  await room.trigger('click')
  expect(room.attributes('aria-pressed')).toBe('false')
  expect(status.attributes('aria-pressed')).toBe('true')

  await room.trigger('click')
  await wrapper.get('.apartment-search__reset').trigger('click')

  expect(room.attributes('aria-pressed')).toBe('false')
  expect(status.attributes('aria-pressed')).toBe('false')
})

it.each(['30', '80', '400000', '800000'])(
  'submits a valid search with Enter in the field with placeholder %s',
  async (placeholder) => {
    const wrapper = mount(PresentationApartmentSearch)
    await wrapper.get('.apartment-search__trigger').trigger('click')

    const input = wrapper.get(`input[placeholder="${placeholder}"]`)
    await input.setValue(placeholder)

    expect(wrapper.emitted('filter-results')).toBeUndefined()

    await input.trigger('keydown', { key: 'Enter' })

    const results = wrapper.emitted('filter-results')
    expect(results).toHaveLength(1)
    expect(results[0][0]).toContain('A-0-1')
    expect(wrapper.find('.apartment-search__apartments').exists()).toBe(true)
  },
)

it('does not submit an invalid price range with Enter', async () => {
  const wrapper = mount(PresentationApartmentSearch)
  await wrapper.get('.apartment-search__trigger').trigger('click')

  const minPrice = wrapper.get('input[placeholder="400000"]')
  const maxPrice = wrapper.get('input[placeholder="800000"]')
  await minPrice.setValue('800000')
  await maxPrice.setValue('400000')

  await maxPrice.trigger('keydown', { key: 'Enter' })

  expect(wrapper.get('[role="alert"]').text()).toContain('Minimalna cena')
  expect(wrapper.emitted('filter-results')).toBeUndefined()
  expect(wrapper.find('.apartment-search__apartments').exists()).toBe(false)
})
