import axios from 'axios';

async function login(email, password) {
    try {
        const url = 'https://app.capijzo.com/api/auth/login';
        const res = await axios.post(url, {
            email: email,
            password: password,
        });
        return res.data;
    } catch (err) {
        let error = {
            status: 'unknown',
            data: {
                message: 'Unknown',
            },
        };
        if (err && err.response) {
            error = err.response;
        }
        throw error;
    }
}

async function getAuthInfo() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['access_token', 'user', 'token_type'], (authInfo) => {
            resolve(authInfo);
        });
    });
}

async function getSnippets() {
    const authInfo = await getAuthInfo();
    try {
        const url = 'https://app.capijzo.com/api/v1/snippets?user_id=' + authInfo.user.id;
        const res = await axios.get(url, {
            headers: { Authorization: authInfo.token_type + ' ' + authInfo.access_token },
        });
        return res.data;
    } catch (err) {
        let error = {
            status: 'unknown',
            data: {
                message: 'Unknown',
            },
        };
        if (err && err.response) {
            error = err.response;
        }
        throw error;
    }
}

export default {
    login: login,
    getSnippets: getSnippets,
};