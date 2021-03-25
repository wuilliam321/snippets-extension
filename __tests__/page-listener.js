import pageListener from '../src/core/page-listener';
import parser from '../src/core/parser';
import settings from '../src/core/settings';

const allSnippets = [
  {
    id: 3,
    name: 'Greetings Mail',
    shortcode: 'aa',
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


describe('Detect shortcode', () => {
  test('on `a` pressed isTriggerKey() should false', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('on no key press', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: null }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('on `aa` pressed isTriggerKey() should false', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(listener.shortcode()).toBe('');
  });

  test('on `aaa` pressed isTriggerKey() should false', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(listener.shortcode()).toBe('');
  });

  test('on `aaa/` pressed isTriggerKey() should true', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(listener.shortcode()).toBe('aaa');
  });

  test('on `ggg/` pressed isTriggerKey() should true and short code should be ggg', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(listener.shortcode()).toBe('ggg');
  });

  test('on `gg ggg/` pressed isTriggerKey() should true and short code should be ggg', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(listener.shortcode()).toBe('ggg');
  });
});
describe('Replacement', () => {
  test('given shorcode aa/ triggered replace textarea with parsed html to text', () => {
    settings.setSnippets(allSnippets);
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.value = 'aa/'; // workaround to set a default text (while I can make it dynamically)
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(elem.value).toBe(`Strike\n\n\nHeader 1\n * List\n * List Padding`);
  });

  test('given shorcode bb/ triggered replace textarea with parsed html to text', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.value = 'bb/'; // workaround to set a default text (while I can make it dynamically)
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(elem.value).toBe(`Strike\n\n\nHeader 2\n * List\n * List Padding`);
  });

});
