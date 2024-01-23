import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = {
    getCookies() {
        return axios.get(`${API_URL}/api/cookies`);
    },
    updateCookieStatus(cookieId, blockedStatus) {
        return axios.patch(`${API_URL}/cookies/block/${cookieId}`, { blockedStatus });
    }
}

export default {API_URL, ...api};
