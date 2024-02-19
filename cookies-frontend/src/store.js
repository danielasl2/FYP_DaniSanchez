import { createStore } from 'vuex';
import api from './api';

const store = createStore({
    state: {
        cookies: []
    },
    mutations: {
        UPDATE_COOKIE_STATUS(state, updatedCookie) {
            const index = state.cookies.findIndex(cookie => cookie._id === updatedCookie._id);
            if (index !== -1) {
                state.cookies.splice(index, 1, updatedCookie);
            }
        },
        SET_COOKIES(state, cookies){
            state.cookies = cookies
        },
    },
    actions: {
        async fetchCookies({commit}) {
            let userId = null; 
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
                   // console.log("Retrieved userId:", userId);
                }
    
                const response = await api.getCookies(userId); 
                console.log("Fetched cookies:", response);
                commit('SET_COOKIES', response);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        },
    },
});

export default store;


  