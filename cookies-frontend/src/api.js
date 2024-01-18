import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = {
    getCookies() {
        return axios.get(`${API_URL}/cookies`);
    },
    updateCookieStatus(cookieId, blockedStatus) {
        return axios.patch(`${API_URL}/cookies/block/${cookieId}`, { blockedStatus });
    }
}

export default api;
