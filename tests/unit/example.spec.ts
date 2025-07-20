import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePageView.vue'
import { describe, expect, test } from 'vitest'

describe('HomePageView.vue', () => {
  test('renders home vue', () => {
    const wrapper = mount(HomePage)
    expect(wrapper.text()).toMatch('Ready to create an app?')
  })
})
