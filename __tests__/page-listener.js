import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

jest.mock('../src/core/api');

const allSnippets = [
  {
    id: 4,
    shortcode: 'full',
    text:
      '<p><strong>bold</strong></p><p><em>italic</em></p><p><u>underlined</u></p><p><s>stike</s></p><blockquote>quote</blockquote><pre class="ql-syntax" spellcheck="false">code\n</pre><h1>h1</h1><h2>h2</h2><h3>h3</h3><h4>h4</h4><h5>h5</h5><h6>h6</h6><p>normal</p><ol><li>ordered 1</li><li class="ql-indent-1">ordered 2</li></ol><ul><li>unordered 1</li><li class="ql-indent-1">unordered 2</li></ul><p>subindex <sub>a</sub></p><p>superindex <sup>b</sup></p><p class="ql-indent-1">padding</p><p class="ql-align-right ql-direction-rtl">rigth_hand</p><p><span class="ql-size-small">small</span></p><p>normal</p><p><span class="ql-size-large">large</span></p><p><span class="ql-size-huge">huge</span></p><p>san serif</p><p><span class="ql-font-serif">serif</span></p><p><span class="ql-font-monospace">monospace</span></p><p><span style="color: rgb(230, 0, 0);">with color</span></p><p><span style="background-color: rgb(230, 0, 0);">with background</span></p><p>left</p><p class="ql-align-center">center</p><p class="ql-align-right">right</p><p class="ql-align-justify">justify</p><p><a href="http://geegele,com" rel="noopener noreferrer" target="_blank">link</a></p><p>no format at all</p>',
  },
  {
    id: 3,
    shortcode: 'aa',
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

describe('Detect shortcode', () => {
  let listener;

  beforeAll(() => {
    const store = storage(service);
    const cfg = settings(store);
    const options = {
      cfg,
      store,
    };
    listener = pageListener.PageListener(options);
  });

  beforeEach(() => listener.clearCurrentWord());

  test('on `a` pressed isTriggerKey() should false', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('on no key press', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: null }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('on `aa` pressed isTriggerKey() should false', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(listener.shortcode()).toBe('');
  });

  test('on `aaa` pressed isTriggerKey() should false', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(listener.shortcode()).toBe('');
  });

  test('on `aaa/` pressed isTriggerKey() should true', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(listener.shortcode()).toBe('aaa');
  });

  test('on `ggg/` pressed isTriggerKey() should true and short code should be ggg', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'g' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(listener.shortcode()).toBe('ggg');
  });

  test('on `gg ggg/` pressed isTriggerKey() should true and short code should be ggg', () => {
    const elem = document.createElement('textarea');
    elem.addEventListener('keyup', listener.buildCurrentWord);
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
  let listener;
  beforeEach(async () => {
    const store = storage(service);
    const cfg = settings(store);
    await cfg.setSnippets(allSnippets);
    listener = pageListener.PageListener({ cfg });
  });

  test('if no element given sould throw error', async () => {
    try {
      await listener.replace();
    } catch (err) {
      expect(err).toBe('element is required');
    }
  });

  test('if no element does not have value attr, do not do anything', async () => {
    const result = await listener.replace({});
    expect(result).toEqual({});
  });

  test('given a shortcode should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'aa/';
    const result = await listener.replace(elem);
    expect(elem.value).toBe(`Strike\n\n\nHeader 1\n * List\n * List Padding`);
    expect(result.value).toBe(`Strike\n\n\nHeader 1\n * List\n * List Padding`);
  });

  test('if no shortcode, no replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'aa';
    const result = await listener.replace(elem);
    expect(elem.value).toBe('aa');
    expect(result.value).toBe('aa');
  });

  test('given another shortcode should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'bb/';
    const result = await listener.replace(elem);
    expect(elem.value).toBe(`Strike\n\n\nHeader 2\n * List\n * List Padding`);
    expect(result.value).toBe(`Strike\n\n\nHeader 2\n * List\n * List Padding`);
  });

  test('given a shortcode in the middle should NOT replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'a bb/ a';
    const result = await listener.replace(elem);
    expect(elem.value).toBe('a bb/ a');
    expect(result.value).toBe('a bb/ a');
  });

  test('given a shortcode in with text before should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'before bb/';
    const result = await listener.replace(elem);
    expect(elem.value).toBe(`before Strike\n\n\nHeader 2\n * List\n * List Padding`);
    expect(result.value).toBe(`before Strike\n\n\nHeader 2\n * List\n * List Padding`);
  });

  test('if no snippet, no replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'non-existent/';
    const result = await listener.replace(elem);
    expect(elem.value).toBe('non-existent/');
    expect(result.value).toBe('non-existent/');
  });
});
