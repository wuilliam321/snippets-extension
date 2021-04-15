function App({ store, api }) {
  const login = async (email, password) => {
    try {
      const { access_token, token_type } = await api.login(email, password);
      await store.set('auth', { access_token, token_type });

      const userInfo = await api.userInfo();
      await store.set('userInfo', userInfo);

      return userInfo;
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      const data = await store.remove('auth');
      return data;
    } catch (err) {
      throw err;
    }
  };

  const loadSnippets = async () => {
    try {
      const userInfo = await api.userInfo();
      const snippets = await api.getSnippets(userInfo.id);
      await store.set('snippets', snippets);
      return snippets;
    } catch (err) {
      throw err;
    }
  };

  return {
    login,
    logout,
    loadSnippets,
  };
}

export default App;
