import { shallowMount } from '@vue/test-utils';
import Vuex from 'vuex';
import CookieDashboard from '../src/components/CookieDashboard.vue';

describe('CookieDashboard.vue', () => {
    let store;
    let state;
    let actions;

    beforeEach(() => {
        state = {
            cookies: {
                'Necessary': [{ domain: 'example.com' }, { domain: 'additional.com' }],
                'Tracking': [{ domain: 'anotherdomain.com' }],
                'Advertising ': [{ domain: 'newdomain.com' }, { domain: 'olddomain.com' }, { domain: 'unique.com' }]

            }
        };

        actions = {
        };

        store = new Vuex.Store({
            state,
            actions
        });
    });

    const testCases = [
        { filterDomain: 'example.com', expectedCookieDomains: ['example.com'] },
        { filterDomain: 'anotherdomain.com', expectedCookieDomains: ['anotherdomain.com'] },
        { filterDomain: '', expectedCookieDomains: ['example.com', 'anotherdomain.com', 'additional.com', 'newdomain.com', 'olddomain.com', 'unique.com'] }, 
        { filterDomain: 'nonexistent.com', expectedCookieDomains: [] }, 
        { filterDomain: 'newdomain.com', expectedCookieDomains: ['newdomain.com'] },
        { filterDomain: '.com', expectedCookieDomains: ['example.com', 'anotherdomain.com', 'additional.com', 'newdomain.com', 'olddomain.com'] }, 
        { filterDomain: 'add', expectedCookieDomains: ['additional.com'] }, 
        { filterDomain: 'NEWDOMAIN.COM', expectedCookieDomains: ['newdomain.com'] }, 
        { filterDomain: 'old', expectedCookieDomains: ['olddomain.com'] }, 
        { filterDomain: 'com', expectedCookieDomains: ['example.com', 'anotherdomain.com', 'additional.com', 'newdomain.com', 'olddomain.com'] }, 
        { filterDomain: 'unique.com', expectedCookieDomains: ['unique.com'] } 
    ];

    testCases.forEach(({ filterDomain, expectedCookieDomains }) => {
        test(`filters cookies correctly when filterDomain is '${filterDomain}'`, async () => {
            const wrapper = shallowMount(CookieDashboard, {
                global: {
                    plugins: [store]
                }
            });

            await wrapper.setData({ filterDomain });

            const filteredDomains = Object.values(wrapper.vm.filteredCookies).flat().map(cookie => cookie.domain);
            expect(filteredDomains).toEqual(expect.arrayContaining(expectedCookieDomains));
        });
    });
});
