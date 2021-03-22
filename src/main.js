import axios from 'axios';

function isFormValid(email, password) {
  const isValid = isValidEmail(email) && isValidPassword(password);
  return isValid;
}

function isValidEmail(email) {
  if (email && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return true;
  }
  return false;
}

function isValidPassword(password) {
  if (password) {
    return true;
  }
  return false;
}

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
  isFormValid: isFormValid,
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
  login: login,
};
