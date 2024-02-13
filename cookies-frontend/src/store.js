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
            state.cookies = cookies;
        },
    },
    actions: {
        async fetchCookies({commit}){
            try {
                const response = await api.getCookies();
                commit('SET_COOKIES', response.data);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        },
        async updateCookieStatus({ commit }, {cookieId, blockedStatus}) {
            try {
                const { userId } = await chrome.storage.local.get('userId');
                const response = await api.updateCookieStatus(cookieId, blockedStatus, userId);
                commit('UPDATE_COOKIE_STATUS', response.data);
            } catch (error) {
                console.error('Error updating cookie status:', error);
            }
        },
    },
});

export default store;


  