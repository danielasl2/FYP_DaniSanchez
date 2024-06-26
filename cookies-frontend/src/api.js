import axios from 'axios';

const API_URL = 'https://fyp-danisanchez.onrender.com';

const api = {
    getCookies(userId) {
     //  console.log(`Updating cookie status for UserID: ${userId}`);
        return axios.get(`${API_URL}/api/cookies`, { params: { userId } })
            .then(response => response.data) 
            .catch(error => { throw error; }); 
    },
    updateCookieStatus(cookieId, blockedStatus, userId) {
        console.log(`Sending request to update status for: Cookie ID: ${cookieId}, User ID: ${userId}`);
        return axios.patch(`${API_URL}/api/cookies/block/${cookieId}`, {
            blockedStatus,
            userId
        }).then(response => {
            return response.data;
        }).catch(error => {
            throw error;
        });
        
    }
}

export default api;

