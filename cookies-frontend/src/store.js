import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
    state: {
        cookies: []
    },
    mutations: {
        UPDATE_COOKIE_STATUS(state, updatedCookie) {
            const index = state.cookies.findIndex(cookie => cookie.id === updatedCookie.id);
            if (index !== -1) {
                state.cookies[index] = updatedCookie;
            }
        },
    },
    actions: {
        updateCookieStatus({ commit }, updatedCookie) {
            axios.patch(`/api/cookies/block/${updatedCookie.id}`, { blockedStatus: updatedCookie.blockedStatus })
                .then(response => {
                    commit('UPDATE_COOKIE_STATUS', response.data);
                })
                .catch(error => console.error('Error updating cookie status:', error));
        },
    },
});

export default store;

  