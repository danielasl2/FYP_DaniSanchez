import { createStore } from 'vuex';
import api from './api';
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
        SET_COOKIES(state, cookies){
            state.cookies = cookies;
        },
    },
    actions: {
        async fetchCookies({commit}){
            try{
                /*
                const response = await api.getCookies();
                commit('SET_COOKIES', response.data);
            } catch (error){
                console.log('Error fetching cookies', error);
                */
                const response = await axios.get('http://localhost:3000/api/cookies');
                commit('SET_COOKIES', response.data);
              } catch (error) {
                console.error('Error fetching cookies:', error);
              }
            }
            
        },
        async updateCookieStatus({ commit }, updatedCookie) {
           try{
            const response = await api.updateCookieStatus(updatedCookie.id, updatedCookie.blockedStatus);
            commit('UPDATE_COOKIE_STATUS', response.data);
           } catch(error){
            console.error('Error updating cookie status: ', error);
           }
        },
    },
);

export default store;

  