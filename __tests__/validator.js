import validator from '../src/core/validator';

describe('Login Form', () => {
  test('given an empty email, should return false', () => {
    const result = validator.isValidForm('', '12345');
    expect(result).toBe(false);
  });

  test('given an valid email, should return true', () => {
    const result = validator.isValidForm('a@a.com', '12345');
    expect(result).toBe(true);
  });

  test('given an invalid email, should return false', () => {
    const result = validator.isValidForm('wuilliam', '12345');
    expect(result).toBe(false);
  });

  // Addional Validation Tests
  test('given an invalid email without user, should return false', () => {
    const result = validator.isValidForm('@algo.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email without domain, should return false', () => {
    const result = validator.isValidForm('algo@.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email with spaces, should return false', () => {
    const result = validator.isValidForm('algo espacio@.com', '12345');
    expect(result).toBe(false);
  });

  test('given an empty password, should return false', () => {
    const result = validator.isValidForm('a@a.com', '');
    expect(result).toBe(false);
  });

  test('given a good password and email, should return true', () => {
    const result = validator.isValidForm('a@a.com', 'aoeu');
    expect(result).toBe(true);
  });
});
