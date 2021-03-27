import settings from '../src/core/settings';
import storage from '../src/core/storage';
import api from '../src/core/api';

jest.mock('../src/core/api');

const allSnippets = [
  {
    id: 3,
    shortcode: 'hhh',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
  },
  {
    id: 2,
    shortcode: 'bb',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 2</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
  },
  {
    id: 1,
    shortcode: 'aaa',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
  },
];

const service = {
  set: jest.fn((_, cb) => cb()),
  get: jest.fn((_, cb) => cb({ snippets: allSnippets })),
};

describe('Settings', () => {
  let cfg;

  beforeAll(async () => {
    const store = storage(service);
    cfg = settings(store);
    await cfg.setSnippets(allSnippets);
  });

  // getSnippetByShortcode

  test('should throw error if no store provided', () => {
    expect(() => settings()).toThrowError();
  });

  test('given no shortcode null should return -1', async () => {
    const snippet = await cfg.getSnippetByShortcode();
    expect(snippet).toBe(-1); // not found
  });

  test('given no shortcode should return -1', async () => {
    const snippet = await cfg.getSnippetByShortcode('');
    expect(snippet).toBe(-1); // not found
  });

  test('given valid shortcode return the snippet', async () => {
    const snippet = await cfg.getSnippetByShortcode('hhh');
    expect(snippet.id).toBe(3);
  });

  test('given a different valid shortcode return the snippet', async () => {
    const snippet = await cfg.getSnippetByShortcode('bb');
    expect(snippet.id).toBe(2);
  });

  test('given non-existent shortcode return the -1', async () => {
    const snippet = await cfg.getSnippetByShortcode('non-existent');
    expect(snippet).toBe(-1); // not found
  });

  // setSnippets

  test('given no snippets should return empty list', async () => {
    const snippets = await cfg.setSnippets();
    expect(snippets).toEqual([]);
  });

  test('given non empty snippets should return the list', async () => {
    const snippets = await cfg.setSnippets([{ id: 1 }]);
    expect(snippets).toEqual([{ id: 1 }]);
  });

  // getSnippets

  test('given no snippets should return empty list', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb(undefined)),
    };
    const store = storage(overridenService);
    cfg = settings(store);
    await cfg.setSnippets();
    expect(await cfg.getSnippets()).toEqual([]);
  });

  test('given non empty snippets should return the list', async () => {
    const overridenService = {
      set: jest.fn((_, cb) => cb()),
      get: jest.fn((_, cb) => cb({ snippets: [{ id: 1 }] })),
    };
    const store = storage(overridenService);
    cfg = settings(store);
    await cfg.setSnippets([{ id: 1 }]);
    expect(await cfg.getSnippets()).toEqual([{ id: 1 }]);
  });

  // fetchSnippets

  test('should return an empty list if nothing to fetch', async () => {
    api.getSnippets.mockImplementationOnce(() => Promise.resolve([]));
    const result = await cfg.fetchSnippets();
    expect(result).toEqual([]);
  });

  test('should return an empty list if nothing no data', async () => {
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

  test('should return a snippets when found', async () => {
    api.getSnippets.mockImplementationOnce(() => Promise.resolve([{ id: 1 }]));
    const result = await cfg.fetchSnippets();
    expect(result).toEqual([{ id: 1 }]);
  });

  test('after fetch getSnippets should return the list', async () => {
    const store = storage(service);
    cfg = settings(store);
    await cfg.fetchSnippets();
    const result = await cfg.getSnippets();
    expect(result.length).toBe(3);
    expect(result[0].id).toBe(3);
  });
});
