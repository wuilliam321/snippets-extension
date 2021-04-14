import settings from '../src/core/settings';
import storage from '../src/core/storage';
import Api from '../src/core/api';

const httpClient = {
  post: jest.fn(),
  get: jest.fn(),
};

const service = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((items, cb) => cb(items)),
};

describe('Settings', () => {
  let cfg;

  beforeAll(async () => {
    const store = storage({ service: service });
    cfg = settings({ store: store, api: Api({ store: store, http: httpClient }) });
    await cfg.setSnippets([]);
  });

  // getSnippetByShortcode

  test('should throw error if no store provided', () => {
    expect(() => settings()).toThrowError();
  });

  test('given no shortcode null should return -1', async () => {
    const snippet = await cfg.getSnippetByShortcode();
    expect(snippet).toBe(-1); // not found
  });

  // setSnippets

  test('given no snippets should return empty list', async () => {
    const snippets = await cfg.setSnippets();
    expect(snippets).toEqual([]);
  });

  // getSnippets

  test('given no snippets should return empty list', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb(undefined)),
    };

    const store = storage({ service: overridenService });
    cfg = settings({ store: store, api: Api({ store: store, http: httpClient }) });
    await cfg.setSnippets();
    expect(await cfg.getSnippets()).toEqual([]);
  });

  // fetchSnippets

  test('should return an empty list if nothing to fetch', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb({ token_type: '', auth_token: '' })),
    };

    const store = storage({ service: overridenService });
    cfg = settings({ store: store, api: Api({ store: store, http: httpClient }) });
    httpClient.get.mockReturnValue(Promise.resolve({ data: [] }));
    const result = await cfg.fetchSnippets(42);
    expect(result).toEqual([]);
  });

  test('shoud fail if error', async () => {
    const error = 'some error';
    httpClient.get.mockReturnValue(Promise.reject(error));
    try {
      await cfg.fetchSnippets();
    } catch (err) {
      expect(err).toEqual({
        data: { message: 'Unknown' },
        error: error,
        status: 'unknown',
      });
    }
  });
});
