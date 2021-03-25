import axios from 'axios';

async function login(email, password) {
  try {
    const url = 'https://app.capijzo.com/api/auth/login';
    const { data } = await axios.post(url, {
      email: email,
      password: password,
    });
    return data;
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
};
