import { createStore } from 'vuex';
import api from './api';
import { cookieUtil} from './mixin/cookieUtil';

//formating date here since changed the categorisation method
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

// here is the main vuex
const store = createStore({
    state: {
        cookies: {},
        userId: null,
    },
    // mutations are uses to updates the state of the cookies by category and user id
    mutations: {
        UPDATE_COOKIE_STATUS(state, { category, updatedCookie }) {
            if (state.cookies[category]) {
                const index = state.cookies[category].findIndex(cookie => cookie._id === updatedCookie._id);
                if (index !== -1) {
                    state.cookies[category][index] = updatedCookie;
                }
            }
        },
        SET_COOKIES(state, categorizedCookies) {
            state.cookies = categorizedCookies;
        },
    
        SET_USER_ID(state, userId) {  
          state.userId = userId;
      },
    },
    actions: {
        // to ensure that the google chrome extension is being fill with data
        async initialiseStore({ dispatch }) {
            await dispatch('fetchUserId');
            await dispatch('fetchCookies');
        },
        async fetchCookies({commit, state}) {
            try {
                /*
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
                */
                const rawCookies = await api.getCookies(state.userId);
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
        async blockUnblockCookie({ commit, state }, { cookieId, blockedStatus}) {
           // console.log(`Attempting to update: Cookie ID: ${cookieId}, Blocked Status: ${blockedStatus}, User ID: ${userId}`);
            try {
              const response = await api.updateCookieStatus(cookieId, blockedStatus, state.userId);
              commit('UPDATE_COOKIE_STATUS', response.data);
            } catch (error) {
              console.error('Error blocking/unblocking cookie:', error);
            }
          },
          fetchUserId({commit}){
            return new Promise((resolve, reject) => {
          //  if (chrome && chrome.storage){
              chrome.storage.local.get( ['userId'], (result) => {
                if (result.userId) {
                  commit('SET_USER_ID', result.userId);
                  resolve(result.userId);
                } else {
                  reject('No user ID found');
              }
              /*
              });
            } else {
              reject('Chrome storage is not accessible');
            }
            */
        });
          });
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
  