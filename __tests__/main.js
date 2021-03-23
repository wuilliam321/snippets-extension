import axios from 'axios';
import auth from '../src/lib/auth.service';

jest.mock('axios');

describe('Auth Service', () => {
  test('given invalid login data, should return 401', async () => {
    const res = Promise.reject({ response: { status: 401 } });
    axios.post.mockImplementation(() => res);
    try {
      await auth.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe(401);
    }
  });

  test('given valid login data, should return 200', async () => {
    const res = Promise.resolve({ data: { status: 200 } });
    axios.post.mockImplementation(() => res);
    const result = await auth.login('a@a.com', '1234');
    expect(result.status).toBe(200);
  });

  test('given valid login data, should return access_token', async () => {
    const res = Promise.resolve({ data: { status: 200, access_token: 'some-token' } });
    axios.post.mockImplementation(() => res);
    const result = await auth.login('a@a.com', '1234');
    expect(result.access_token).toBe('some-token');
  });

  test('given unknown error, should retun it', async () => {
    const res = Promise.reject();
    axios.post.mockImplementation(() => res);
    try {
      await auth.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe('unknown');
    }
  });
});

