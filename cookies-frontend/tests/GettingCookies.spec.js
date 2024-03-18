import { shallowMount } from '@vue/test-utils';
import SimpleComponent from '../SimpleComponent.vue';

describe('SimpleComponent', () => {
  it('renders correctly', () => {
    const wrapper = shallowMount(SimpleComponent);
    expect(wrapper.text()).toContain('Hello World');
  });
});

