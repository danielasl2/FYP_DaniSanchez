import { createStore } from 'vuex';
import api from './api';
import { cookieUtil} from './mixin/cookieUtil';

//formating date here since changed the categorisation method now the date is not reading from the utils
function formatCookieDate(dateString){
  if(!dateString|| dateString === 'N/A') return 'N/A';

  let parts = dateString.split('/');
  if (parts.length === 3) {
    dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error('Invalid Date:', dateString);
    return 'Invalid date'; 
}
const day = ("0" + date.getDate()).slice(-2); 
const month = ("0" + (date.getMonth() + 1)).slice(-2);
const year = date.getFullYear();

return `${day}/${month}/${year}`;
}

const store = createStore({
    state: {
        cookies: {},
        userId: null,
    },
    mutations: {
        UPDATE_COOKIE_STATUS(state, { category, updatedCookie }) {

            if (state.cookies[category]) {
                const index = state.cookies[category].findIndex(cookie => cookie._id === updatedCookie._id);
                if (index !== -1) {
                    state.cookies[category][index] = updatedCookie;
                }
            }
        },
        SET_COOKIES(state, rawCookies) {
            const categorizedCookies = {};
            rawCookies.forEach(cookie => {
                const category = cookieUtil.categorisedCookie(cookie);
                if (!categorizedCookies[category]) {
                    categorizedCookies[category] = [];
                }
                categorizedCookies[category].push({
                    ...cookie,
                    expirationDate: formatCookieDate(cookie.expirationDate)
                });
            });
            state.cookies = categorizedCookies;
        },
    
        SET_USER_ID(state, userId) {  
          state.userId = userId;
      },
    },
    actions: {
        async loadCookiesTypes( {dispatch}){
            await cookieUtil.loadCookiesType();
            await dispatch ('fetchCookies');
        },
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
                }
    
                const rawCookies = await api.getCookies(userId);
                const categorizedCookies = rawCookies.map(cookie => ({
                  ...cookie,
                  category: cookieUtil.categorisedCookie(cookie),
                  expirationDate: formatCookieDate(cookie.expirationDate),
                }));
        
                console.log("Processed cookie for vuex:", categorizedCookies);
                commit('SET_COOKIES', categorizedCookies);
            } catch (error) {
                console.error('Error fetching cookies:', error);
            }
        },
        async blockUnblockCookie({ commit }, { cookieId, blockedStatus, userId }) {
            console.log(`Attempting to update: Cookie ID: ${cookieId}, Blocked Status: ${blockedStatus}, User ID: ${userId}`);
            try {
              const response = await api.updateCookieStatus(cookieId, blockedStatus, userId);
              commit('UPDATE_COOKIE_STATUS', response.data);
            } catch (error) {
              console.error('Error blocking/unblocking cookie:', error);
            }
          },
         async fetchUserId({commit}){
            try {
                const userId = await new Promise((resolve, reject) => {
                    chrome.storage.local.get(['userId'], result => {
                        if (result.userId) {
                            resolve(result.userId);
                        } else {
                            reject('No user ID found');
                        }
                    });
                });
                commit('SET_USER_ID', userId);
            } catch (error) {
                console.error('Chrome storage is not accessible', error);
            }
        }
    },
    async toggleBlockStatus({ dispatch, state }, cookie) {
      try {
          const userId = state.userId; 
          if (!userId) {
              console.error('No user ID found for blocking/unblocking cookies');
              return;
          }
          await dispatch('blockUnblockCookie', {
              cookieId: cookie._id,
              blockedStatus: !cookie.blockedStatus, 
              userId: userId
          });
      } catch (error) {
          console.error('Error toggling cookie status:', error);
      }
  },
    getters: {
        chartData: (state) => {
            return Object.keys(state.cookies).map( category => ({
                category: category,
                count: state.cookies[category].length
            })

            )
        },
        categorizedCookies: (state) => {
            return state.cookies;
        }
    }
    },
);

export default store;
  