import form from '../src/lib/login.form';

describe('Login Form', () => {
  test('given an empty email, should return false', () => {
    const result = form.isValidForm('', '12345');
    expect(result).toBe(false);
  });

  test('given an valid email, should return true', () => {
    const result = form.isValidForm('a@a.com', '12345');
    expect(result).toBe(true);
  });

  test('given an invalid email, should return false', () => {
    const result = form.isValidForm('wuilliam', '12345');
    expect(result).toBe(false);
  });

  // Addional Validation Tests
  test('given an invalid email without user, should return false', () => {
    const result = form.isValidForm('@algo.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email without domain, should return false', () => {
    const result = form.isValidForm('algo@.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email with spaces, should return false', () => {
    const result = form.isValidForm('algo espacio@.com', '12345');
    expect(result).toBe(false);
  });
});

describe('Pasword Form Validation', () => {
  test('given an empty password, should return false', () => {
    const result = form.isValidForm('a@a.com', '');
    expect(result).toBe(false);
  });

  test('given a good password and email, should return true', () => {
    const result = form.isValidForm('a@a.com', 'aoeu');
    expect(result).toBe(true);
  });
});
