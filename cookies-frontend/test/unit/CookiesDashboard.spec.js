import { mount } from '@vue/test-utils';
import CookieDashboard from '/Users/danielasanchezlopez/Documents/GitHub/FYP_DaniSanchez/cookies-frontend/src/components/CookieDashboard.vue'; 
import { createStore } from 'vuex';


const mockStore = createStore({
  state: {
    cookies: {},
    userId: 'test-user',
  },
  actions: {
    fetchCookies: jest.fn(),
    blockUnblockCookie: jest.fn(),
  },
  getters: {

  },
});

global.chrome = {
  tabs: {
    query: jest.fn((queryInfo, callback) => {
      callback([{ url: 'https://www.example.com' }]);
    }),
  },
};

describe('CookieDashboard.vue', () => {
  let wrapper;

  beforeEach(() => {

    wrapper = mount(CookieDashboard, {
      global: {
        plugins: [mockStore], 
      },
    });
  });

  it('initializes with the correct data', () => {
    expect(wrapper.vm.showKey).toBe(false);
    expect(wrapper.vm.showCharts).toBe(false);
    expect(wrapper.vm.filterDomain).toBe('');
  });

  it('fetches cookies when component is created', async () => {
    mount(CookieDashboard, { global: { plugins: [mockStore] } });
    expect(mockStore.dispatch).toHaveBeenCalledWith('fetchCookies');
  });
  
});
