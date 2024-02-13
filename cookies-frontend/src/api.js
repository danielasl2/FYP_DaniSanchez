import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = {
    getCookies() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get('userId', async (result) => {
                if (result.userId) {
                    try {
                        const response = await axios.get(`${API_URL}/api/cookies`, { params: { userId: result.userId } });
                        resolve(response);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error('userId not found'));
                }
            });
        });
    },
    updateCookieStatus(cookieId, blockedStatus, userId) {
        return axios.patch(`${API_URL}/api/cookies/block/${cookieId}`, { blockedStatus, userId });
    }
}

export default api;

