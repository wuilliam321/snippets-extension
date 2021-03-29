import settings from '../src/core/settings';
import storage from '../src/core/storage';
import api from '../src/core/api';

jest.mock('../src/core/api');

const service = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((items, cb) => cb(items)),
};

describe('Settings', () => {
  let cfg;

  beforeAll(async () => {
    const store = storage(service);
    cfg = settings(store);
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
    const store = storage(service);
    cfg = settings(store);
    await cfg.setSnippets();
    expect(await cfg.getSnippets()).toEqual([]);
  });

  // fetchSnippets

  test('should return an empty list if nothing to fetch', async () => {
    api.getSnippets.mockImplementationOnce(() => Promise.resolve([]));
    const result = await cfg.fetchSnippets();
    expect(result).toEqual([]);
  });

  test('shoud fail if error', async () => {
    const error = {
      status: 'unknown',
      data: {
        message: 'Unknown',
      },
    };
    api.getSnippets.mockImplementationOnce(() => Promise.reject(error));
    try {
      await cfg.fetchSnippets();
    } catch (err) {
      expect(err).toEqual(error);
    }
  });
});
