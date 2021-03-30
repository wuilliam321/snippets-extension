import api from './api';

function Settings(store) {
    if (!store) {
        throw new Error('store should be provided');
    }

    const getSnippetByShortcode = async(shortcode) => {
        if (!shortcode) {
            return Promise.resolve(-1);
        }

        const snippets = await getSnippets();
        const snippet = snippets.find((s) => s.shortcode === shortcode);

        if (!snippet) {
            return Promise.resolve(-1);
        }

        return Promise.resolve(snippet);
    };

    const setSnippets = async(snippets) => {
        if (snippets === undefined) {
            return Promise.resolve([]);
        }
        if (snippets && snippets.length) {
            const res = await store.set('snippets', snippets);
            if (Object.keys(res).length) {
                // TODO not tested
                return Promise.resolve(res.snippets);
            }
        }
        return Promise.resolve([]);
    };

    const getSnippets = async() => {
        // TODO not tested
        const res = await store.get('snippets');
        if (!res || !res.snippets) {
            return Promise.resolve([]);
        }
        return Promise.resolve(res.snippets);
    };

    const fetchSnippets = () => {
        return new Promise(async(resolve, reject) => {
            try {
                const data = await api.getSnippets();
                if (data) {
                    await setSnippets(data);
                    resolve(data);
                }
                resolve([]);
            } catch (err) {
                reject(err);
            }
        });
    };
    const fetchUserInfo = () => {
        return new Promise(async(resolve, reject) => {
            try {
                const data = await api.getUser();
                if (data) {
                    await setUserInfo(data);
                    resolve(data);
                }
                resolve({});
            } catch (err) {
                reject(err);
            }
        });
    };
    const setUserInfo = async(userInfo) => {
        if (userInfo === undefined) {
            return Promise.resolve({});
        } else {
            const res = await store.set('userInfo', userInfo);
            if (Object.keys(res).length) {
                // TODO not tested
                return Promise.resolve(res.userInfo);
            }
        }
        return Promise.resolve({});
    };
    const getUserInfo = async() => {
        // TODO not tested
        const res = await store.get('userInfo');
        if (!res || !res.userInfo) {
            return Promise.resolve({});
        }
        return Promise.resolve(res.userInfo);
    };

    return {
        getSnippetByShortcode,
        setSnippets,
        getSnippets,
        fetchSnippets,
        fetchUserInfo,
        setUserInfo,
        getUserInfo,
    };
}
export default Settings;