const Api = ({ store, http }) => {
  // TODO: store does not belongs to thiss, passs token, instead

  async function login(email, password) {
    try {
      const url = 'https://app.capijzo.com/api/auth/login';
      const res = await http.post(url, {
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
        error: err,
      };
      if (err && err.response) {
        error = err.response;
      }
      throw error;
    }
  }

  async function userInfo() {
    try {
      const authInfo = await store.get('auth');
      esto esta mal
      console.log('auth', authInfo);
      const url = 'https://app.capijzo.com/api/auth/user';
      const res = await http.get(url, {
        headers: { Authorization: authInfo.token_type + ' ' + authInfo.access_token },
      });
      return res.data;
    } catch (err) {
      let error = {
        status: 'unknown',
        data: {
          message: 'Unknown',
        },
        error: err,
      };
      if (err && err.response) {
        error = err.response;
      }
      throw error;
    }
  }

  // TODO: pass the user info in params instead
  async function getSnippets(userId) {
    try {
      const authInfo = await store.get('auth');
      const url = 'https://app.capijzo.com/api/v1/snippets?user_id=' + userId;
      const res = await http.get(url, {
        headers: { Authorization: authInfo.token_type + ' ' + authInfo.access_token },
      });
      return res.data;
    } catch (err) {
      let error = {
        status: 'unknown',
        data: {
          message: 'Unknown',
        },
        error: err,
      };
      if (err && err.response) {
        error = err.response;
      }
      throw error;
    }
  }

  return {
    login,
    getSnippets,
    userInfo,
  };
};

export default Api;
