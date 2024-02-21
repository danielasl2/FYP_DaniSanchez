import { createStore } from 'vuex';
import api from './api';
import { cookieUtil} from './mixin/cookieUtil';

const store = createStore({
    state: {
        cookies: {}
    },
    mutations: {
        UPDATE_COOKIE_STATUS(state, updatedCookie) {
            const category = cookieUtil.categorisedCookie(updatedCookie);
            const index = state.cookies[category]?.findIndex(cookie => cookie._id === updatedCookie._id);
            if (index !== -1) {
                state.cookies[category][index] = updatedCookie;
            }
        },
        SET_COOKIES(state, cookieMix){
            console.log('Updating cookies in the store ', cookieMix)
            state.cookies = cookieMix;
        },
    },
    actions: {
        async fetchCookies({commit}) {
            let userId = null; 
            console.log('Fetching cookies for user:', userId);  
            try {
                if (chrome && chrome.storage) {
                    userId = await new Promise((resolve, reject) => {
                        chrome.storage.local.get(['userId'], (result) => {
                            if (result.userId) {
                                resolve(result.userId);
                            } else {
                                reject('No user ID found');
                            }
                        });
                    });
                   console.log("Retrieved userId:", userId);
                }
    
                const rawCookies = await api.getCookies(userId); 
                console.log('Raw cookies received:', rawCookies);
                const cookieMix= {};

                rawCookies.forEach(cookie => {
                    const category = cookieUtil.categorisedCookie(cookie);
                    if(! cookieMix[category]){
                        cookieMix[category] = [];
                    }
                    cookieMix[category].push(cookie);
                })
               // console.log("Fetched cookies:", response);
                commit('SET_COOKIES', cookieMix);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        },
    },
});

export default store;


  