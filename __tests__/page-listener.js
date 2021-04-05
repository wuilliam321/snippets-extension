import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';
import parser from '../src/core/parser';

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

const eventName = 'input';

describe('Detect shortcode', () => {
  let listener;

  beforeAll(() => {
    const store = storage(service);
    const cfg = settings(store);
    cfg.fetchSnippets();
    listener = pageListener.PageListener(cfg);
  });

  // input and textarea

  test('on `a` pressed isTriggerKey() should false', () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: null }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('on `aa` pressed isTriggerKey() should false', async () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(await listener.getShortcode(elem.value)).toBe('');
  });

  test('on `aaa` pressed isTriggerKey() should false', async () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(await listener.getShortcode(elem.value)).toBe('');
  });

  test('on `aaa/` pressed isTriggerKey() should true', async () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.value = 'aaa/'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(elem.value)).toBe('aaa');
  });

  test('on `ggg/` pressed isTriggerKey() should true and short code should be ggg', async () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.value = 'ggg/'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(elem.value)).toBe('ggg');
  });

  test('on `gg ggg/` pressed isTriggerKey() should true and short code should be ggg', async () => {
    const elem = document.createElement('textarea');
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: ' ' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.value = 'gg ggg/'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(elem.value)).toBe('ggg');
  });

  // contenteditable

  test('contenteditable on `a` pressed isTriggerKey() should false', () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('contenteditable on no key press', () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: null }));
    expect(listener.isTriggerKey()).toBe(false);
  });

  test('contenteditable on `aa` pressed isTriggerKey() should false', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(await listener.getShortcode(parser.parseHtmlToText(elem.innerHTML))).toBe('');
  });

  test('contenteditable on `aaa` pressed isTriggerKey() should false', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    expect(listener.isTriggerKey()).toBe(false);
    expect(await listener.getShortcode(parser.parseHtmlToText(elem.innerHTML))).toBe('');
  });

  test('contenteditable on `aaa/` pressed isTriggerKey() should true', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.innerHTML = '<p>aaa/</p>'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(parser.parseHtmlToText(elem.innerHTML))).toBe('aaa');
  });

  test('contenteditable on `ggg/` pressed isTriggerKey() should true and short code should be ggg', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.innerHTML = '<p>ggg/</p>'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(parser.parseHtmlToText(elem.innerHTML))).toBe('ggg');
  });

  test('contenteditable on `gg ggg/` pressed isTriggerKey() should true and short code should be ggg', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: ' ' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'g' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.innerHTML = '<p>gg ggg/</p>'; // hardcoded because unavailable to trigger change on node
    expect(await listener.getShortcode(parser.parseHtmlToText(elem.innerHTML))).toBe('ggg');
  });

  test('contenteditable on `gg aaa/ gg` in the middle pressed isTriggerKey() should true and short code should be ggg', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: 'a' }));
    elem.dispatchEvent(new InputEvent(eventName, { data: '/' }));
    elem.innerHTML = '<p>gg aaa/ gg</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 7);
    expect(result.innerHTML).toBe(
      '<p>gg </p><p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul> gg<p></p>',
    );
  });
});

describe('Replacement', () => {
  let listener;
  beforeEach(async () => {
    const store = storage(service);
    const cfg = settings(store);
    await cfg.setSnippets(allSnippets);
    listener = pageListener.PageListener(cfg);
  });

  // replacePlainText

  test('if no element given sould throw error', async () => {
    try {
      await listener.replacePlainText();
    } catch (err) {
      expect(err).toBe('element is required');
    }
  });

  test('if no element does not have value attr, do not do anything', async () => {
    const result = await listener.replacePlainText({});
    expect(result).toEqual({});
  });

  test('given a shortcode should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'aa/';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe(`Strike\n\n\nHeader 1\n * List\n * List Padding`);
    expect(result.value).toBe(`Strike\n\n\nHeader 1\n * List\n * List Padding`);
  });

  test('if no shortcode, no replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'aa';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe('aa');
    expect(result.value).toBe('aa');
  });

  test('given another shortcode should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'bb/';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe(`Strike\n\n\nHeader 2\n * List\n * List Padding`);
    expect(result.value).toBe(`Strike\n\n\nHeader 2\n * List\n * List Padding`);
  });

  test('given a shortcode in the middle should NOT replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'a bb/ a';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe('a bb/ a');
    expect(result).toBe(-1);
  });

  test('given a shortcode in the middle but cursor is in that position should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'a bb/ a';
    const result = await listener.replacePlainText(elem, 5);
    expect(elem.value).toBe('a Strike\n\n\nHeader 2\n * List\n * List Padding a');
    expect(result.value).toBe('a Strike\n\n\nHeader 2\n * List\n * List Padding a');
  });

  test('given a multiline value should replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = `a bb/\n a`;
    const result = await listener.replacePlainText(elem, 5);
    expect(elem.value).toBe('a Strike\n\n\nHeader 2\n * List\n * List Padding\n a');
    expect(result.value).toBe('a Strike\n\n\nHeader 2\n * List\n * List Padding\n a');
  });

  test('given a multiline, but shortcode at the beging value should replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = `a\nbb/ a`;
    const result = await listener.replacePlainText(elem, 5);
    const expected = 'a\nStrike\n\n\nHeader 2\n * List\n * List Padding a';
    expect(elem.value).toBe(expected);
    expect(result.value).toBe(expected);
  });

  test('given a shortcode in with text before should replace it', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'before bb/';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe(`before Strike\n\n\nHeader 2\n * List\n * List Padding`);
    expect(result.value).toBe(`before Strike\n\n\nHeader 2\n * List\n * List Padding`);
  });

  test('if no snippet, no replace', async () => {
    const elem = document.createElement('textarea');
    elem.value = 'non-existent/';
    const result = await listener.replacePlainText(elem);
    expect(elem.value).toBe('non-existent/');
    expect(result).toBe(-1);
  });

  // replaceHtml

  test('contenteditable if no element given sould throw error', async () => {
    try {
      await listener.replaceHtml();
    } catch (err) {
      expect(err).toBe('element is required');
    }
  });

  test('contenteditable if no element does not have value attr, do not do anything', async () => {
    const result = await listener.replaceHtml({});
    expect(result).toEqual({});
  });

  test('contenteditable given a shortcode should replace it', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>aa/</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 6);
    const expected =
      '<p></p><p><s>Strike</s></p><p><br></p><h1>Header 1</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul><p></p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result.innerHTML).toBe(expected);
  });

  test('contenteditable if no shortcode, no replace', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>aa</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 5);
    const expected = '<p>aa</p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result.innerHTML).toBe(expected);
  });

  test('contenteditable given another shortcode should replace it', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>bb/</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 6);
    const expected =
      '<p></p><p><s>Strike</s></p><p><br></p><h1>Header 2</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul><p></p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result.innerHTML).toBe(expected);
  });

  test('contenteditable given a shortcode in the middle should NOT replace it', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>aa bb/ a</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 11);
    const expected = '<p>aa bb/ a</p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result).toBe(-1);
  });

  test('contenteditable given a shortcode in with text before should replace it', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>before bb/</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 13);
    const expected =
      '<p>before </p><p><s>Strike</s></p><p><br></p><h1>Header 2</h1><ul><li>List</li><li class="ql-indent-1">List Padding</li></ul><p></p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result.innerHTML).toBe(expected);
  });

  test('contenteditable if no snippet, no replace', async () => {
    const elem = document.createElement('div');
    elem.setAttribute('contenteditable', true);
    elem.innerHTML = '<p>non-existent/</p>'; // hardcoded because unavailable to trigger change on node
    const result = await listener.replaceHtml(elem, 16);
    const expected = '<p>non-existent/</p>';
    expect(elem.innerHTML).toBe(expected);
    expect(result).toBe(-1);
  });

  // TODO: add testing library to effectively simulate button actions
  // oeuaoeu
  // test('on `/` pressed isTriggerKey() should true but should not replace anything', async () => {
  //   const store = storage(service);
  //   const cfg = settings(store);
  //   const listenerWithMock = pageListener.PageListener(cfg);
  //   listenerWithMock.replacePlainText = jest.fn();
  //   const elem = document.createElement('textarea');
  //   elem.addEventListener(eventName, listenerWithMock.inputListener);
  //   document.body.append(elem);
  //   const e = screen.getByRole('textbox');
  //   userEvent.type(e, '/');

  //   await waitFor(() => {
  //     expect(listenerWithMock.isTriggerKey()).toBe(true);
  //     expect(listenerWithMock.replacePlainText).toHaveBeenCalled();
  //   });
  // });
});
