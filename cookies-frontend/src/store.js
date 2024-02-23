import { createStore } from 'vuex';
import api from './api';
import { cookieUtil} from './mixin/cookieUtil';

//formating date here since changed the categorisation method now the date is not reading from the utils
function formatCookieDate(dateString){
 // console.log("Original seconds:", dateString);
  if(!dateString) return 'N/A';

  const date = new Date(dateString);
//  console.log("Converted Date object:", date);

  if (isNaN(date.getTime())) {
 //   console.log("Invalid Date for input:", dateString);
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
        SET_USER_ID(state, userId) {  
          state.userId = userId;
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
                    cookie.expirationDate = formatCookieDate(cookie.expirationDate);
                    cookieMix[category].push(cookie);
                })
               // console.log("Fetched cookies:", response);
                commit('SET_COOKIES', cookieMix);
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
          fetchUserId({commit}){
            return new Promise((resolve, reject) => {
            if (chrome && chrome.storage){
              chrome.storage.local.get( ['userId'], (result) => {
                if (result.userId) {
                  commit('SET_USER_ID', result.userId);
                  resolve(result.userId);
                } else {
                  reject('No user ID found');
              }
              });
            } else {
              reject('Chrome storage is not accessible');
            }
          });
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


  