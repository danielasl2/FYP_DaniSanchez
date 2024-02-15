import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = {
    getCookies(userId) {
        return axios.get(`${API_URL}/api/cookies`, { params: { userId } })
            .then(response => response.data) 
            .catch(error => { throw error; }); 
    },
    updateCookieStatus(cookieId, blockedStatus, userId) {
        return axios.patch(`${API_URL}/api/cookies/block/${cookieId}`, { blockedStatus, userId });
    }
}

export default api;

