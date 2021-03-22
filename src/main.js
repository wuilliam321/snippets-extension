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

export default {
  isFormValid: isFormValid,
  isValidEmail: isValidEmail,
  isValidPassword: isValidPassword,
};
