import axios from 'axios';
import main from '../src/main';

jest.mock('axios');
// axios.post.mockResolvedValue({ status: 401 });

describe('Form Requests', () => {
  test('given invalid login data, should return 401', async () => {
    const res = Promise.reject({ response: { status: 401 } });
    axios.post.mockImplementation(() => res);
    try {
      await main.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe(401);
    }
  });

  test('given valid login data, should return 200', async () => {
    const res = Promise.resolve({ data: { status: 200 } });
    axios.post.mockImplementation(() => res);
    const result = await main.login('a@a.com', '1234');
    expect(result.status).toBe(200);
  });

  test('given valid login data, should return access_token', async () => {
    const res = Promise.resolve({ data: { status: 200, access_token: 'some-token' } });
    axios.post.mockImplementation(() => res);
    const result = await main.login('a@a.com', '1234');
    expect(result.access_token).toBe('some-token');
  });

  test('given unknown error, should retun it', async () => {
    const res = Promise.reject();
    axios.post.mockImplementation(() => res);
    try {
      await main.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe('unknown');
    }
  });
});

describe('Email Form Validation', () => {
  test('given an empty email, should return false', () => {
    const result = main.isFormValid('', '12345');
    expect(result).toBe(false);
  });

  test('given an valid email, should return true', () => {
    const result = main.isFormValid('a@a.com', '12345');
    expect(result).toBe(true);
  });

  test('given an invalid email, should return false', () => {
    const result = main.isFormValid('wuilliam', '12345');
    expect(result).toBe(false);
  });

  // Addional Validation Tests
  test('given an invalid email without user, should return false', () => {
    const result = main.isFormValid('@algo.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email without domain, should return false', () => {
    const result = main.isFormValid('algo@.com', '12345');
    expect(result).toBe(false);
  });

  test('given an invalid email with spaces, should return false', () => {
    const result = main.isFormValid('algo espacio@.com', '12345');
    expect(result).toBe(false);
  });
});

describe('Pasword Form Validation', () => {
  test('given an empty password, should return false', () => {
    const result = main.isFormValid('a@a.com', '');
    expect(result).toBe(false);
  });

  test('given a good password and email, should return true', () => {
    const result = main.isFormValid('a@a.com', 'aoeu');
    expect(result).toBe(true);
  });
});
