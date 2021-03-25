import settings from '../src/core/settings';

const allSnippets = [
  {
    id: 3,
    name: 'Greetings Mail',
    shortcode: 'hhh',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
    category_id: 62,
    pivot: {
      user_id: 57,
      item_id: 73,
      item_type: 'App\\Models\\Snippet',
      scope: 1,
      approved: 1,
    },
    category: {
      id: 62,
      name: 'test',
      color_id: 5,
      created_at: '2021-03-24T03:29:35.000000Z',
      updated_at: '2021-03-24T03:29:35.000000Z',
      color: { id: 5, hex: '#0077B6' },
    },
    labels: [],
    users: [],
  },
  {
    id: 2,
    name: 'Greetings Mail',
    shortcode: 'bb',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 2</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
    category_id: 62,
    pivot: {
      user_id: 57,
      item_id: 73,
      item_type: 'App\\Models\\Snippet',
      scope: 1,
      approved: 1,
    },
    category: {
      id: 62,
      name: 'test',
      color_id: 5,
      created_at: '2021-03-24T03:29:35.000000Z',
      updated_at: '2021-03-24T03:29:35.000000Z',
      color: { id: 5, hex: '#0077B6' },
    },
    labels: [],
    users: [],
  },
  {
    id: 1,
    name: 'Greetings Mail',
    shortcode: 'aaa',
    text:
      '<p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul>',
    category_id: 62,
    pivot: {
      user_id: 57,
      item_id: 73,
      item_type: 'App\\Models\\Snippet',
      scope: 1,
      approved: 1,
    },
    category: {
      id: 62,
      name: 'test',
      color_id: 5,
      created_at: '2021-03-24T03:29:35.000000Z',
      updated_at: '2021-03-24T03:29:35.000000Z',
      color: { id: 5, hex: '#0077B6' },
    },
    labels: [],
    users: [],
  },
];

describe('Settings getSnippetByShortcode', () => {
  test('given no shortcode null should return -1', () => {
    const snippet = settings.getSnippetByShortcode();
    settings.setSnippets(allSnippets);
    expect(snippet).toBe(-1); // not found
  });

  test('given no shortcode should return -1', () => {
    const snippet = settings.getSnippetByShortcode('');
    settings.setSnippets(allSnippets);
    expect(snippet).toBe(-1); // not found
  });

  test('given valid shortcode return the snippet', () => {
    const snippet = settings.getSnippetByShortcode('hhh');
    settings.setSnippets(allSnippets);
    expect(snippet.id).toBe(3);
  });

  test('given a different valid shortcode return the snippet', () => {
    const snippet = settings.getSnippetByShortcode('bb');
    settings.setSnippets(allSnippets);
    expect(snippet.id).toBe(2);
  });

  test('given non-existent shortcode return the -1', () => {
    const snippet = settings.getSnippetByShortcode('non-existent');
    settings.setSnippets(allSnippets);
    expect(snippet).toBe(-1); // not found
  });
});

describe('Settings setSnippets', () => {
  test('given no snippets should return empty list', () => {
    const snippets = settings.setSnippets();
    expect(snippets).toEqual([]);
  });

  test('given non empty snippets should return the list', () => {
    const snippets = settings.setSnippets([{ id: 1 }]);
    expect(snippets).toEqual([{ id: 1 }]);
  });
});

describe('Settings getSnippets', () => {
  test('given no snippets should return empty list', () => {
    settings.setSnippets();
    expect(settings.getSnippets()).toEqual([]);
  });

  test('given non empty snippets should return the list', () => {
    settings.setSnippets([{ id: 1 }]);
    expect(settings.getSnippets()).toEqual([{ id: 1 }]);
  });
});
