import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = {
    getCookies(userId) {
     //  console.log(`Updating cookie status for UserID: ${userId}`);
        return axios.get(`${API_URL}/api/cookies`, { params: { userId } })
            .then(response => response.data) 
            .catch(error => { throw error; }); 
    },
    updateCookieStatus(cookieId, blockedStatus, userId) {
        console.log(`Sending request to update status for: Cookie ID: ${cookieId}, User ID: ${userId}`);
        /*
        console.log('Update cookie function is called');
        console.log('this is the user id: ', userId);
        return axios.patch(`${API_URL}/api/cookies/block/${cookieId}`, { blockedStatus, userId });
        */
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

