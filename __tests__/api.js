import api from '../src/core/api';

const httpClient = {
  post: jest.fn(),
};

const store = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((items, cb) => cb(items)),
};

describe('Auth Service', () => {
  let restApi;
  beforeAll(() => {
    restApi = api({ store: store, http: httpClient });
  });

  test('given invalid login data, should return 401', async () => {
    const res = Promise.reject({ response: { status: 401 } });
    httpClient.post.mockReturnValue(res);
    try {
      await restApi.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe(401);
    }
  });

  test('given valid login data, should return 200', async () => {
    const res = Promise.resolve({ data: { status: 200 } });
    httpClient.post.mockReturnValue(res);
    const result = await restApi.login('a@a.com', '1234');
    expect(result.status).toBe(200);
  });

  test('given valid login data, should return access_token', async () => {
    const res = Promise.resolve({ data: { status: 200, access_token: 'some-token' } });
    httpClient.post.mockReturnValue(res);
    const result = await restApi.login('a@a.com', '1234');
    expect(result.access_token).toBe('some-token');
  });

  test('given unknown error, should retun it', async () => {
    const res = Promise.reject();
    httpClient.post.mockReturnValue(res);
    try {
      await restApi.login('a@a.com', '');
    } catch (err) {
      expect(err.status).toBe('unknown');
    }
  });
});
