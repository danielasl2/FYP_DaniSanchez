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
           // console.log('Updating cookies in the store ', cookieMix)
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
                //   console.log("Retrieved userId:", userId);
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
        async blockUnblockCookie({ commit }, { cookieId, blockedStatus, userId }) {
            console.log(`Vuex action received - Cookie ID: ${cookieId}, Blocked Status: ${blockedStatus}, User ID: ${userId}`);
            try {
              const updatedCookie = await api.updateCookieStatus(cookieId, blockedStatus, userId);
              commit('UPDATE_COOKIE_STATUS', updatedCookie);
            } catch (error) {
              console.error('Error blocking/unblocking cookie:', error);
            }
          }
    },
    methods:{
        async toggleBlockStatus(cookie) {
            try {
              const userId = await this.getUserID(); 
              console.log(`Toggling block status for cookie ID: ${cookie._id}, User ID: ${userId}`); 
              if (!userId) {
                console.error('No user ID found for blocking/unblocking cookies');
                return;
              }
              this.$store.dispatch('blockUnblockCookie', {
                cookieId: cookie._id,
                blockedStatus: !cookie.blockedStatus, 
                userId: userId
              });
            } catch (error) {
              console.error('Error toggling cookie status:', error);
            }
          },
          getUserID() {
            return new Promise((resolve) => {
              if (chrome && chrome.storage) {
                chrome.storage.local.get(['userId'], (result) => {
                  resolve(result.userId || null);
                });
              } else {
                resolve(null); 
              }
            });
        },
    },
});

export default store;


  