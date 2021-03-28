import parser from '../src/core/parser';

describe('Parser', () => {
  // TODO need a detectFormatFor(element) to detect available format for it
  // html or text or some other, and then parse(format)
  // parse(format) should call parseStringHtml or parseStringHtmlToText

  // parseHtml

  test('given no content, should return empty string', () => {
    const parsed = parser.parseHtml();
    expect(parsed).toBe('');
  });

  test('given a content, should not return empty string', () => {
    const parsed = parser.parseHtml('test');
    expect(parsed).not.toBe('');
  });

  test('given partially valid html should return a correct fragment', () => {
    const parsed = parser.parseHtml('<b>test');
    const element = new DocumentFragment();
    const child = document.createElement('b');
    child.textContent = 'test';
    element.append(child);
    expect(parsed).toEqual(element);
  });

  test('given plain test should return a fragment with plain text on it', () => {
    const parsed = parser.parseHtml('test');
    const element = new DocumentFragment();
    element.textContent = 'test';
    expect(parsed).toEqual(element);
  });

  // parseHtmlToText

  test('given no text should return empty string', () => {
    const parsed = parser.parseHtmlToText();
    expect(parsed).toBe('');
  });

  test('given empty string should return empty string', () => {
    const parsed = parser.parseHtmlToText('');
    expect(parsed).toBe('');
  });

  test('given valid header string should return header formatted text', () => {
    const parsed = parser.parseHtmlToText('<h1>header</h1>');
    expect(parsed).toBe('header');
  });

  test('given valid header with p string should return header formatted text', () => {
    const parsed = parser.parseHtmlToText('<h1>header</h1><p>paragraph</p>');
    expect(parsed).toBe(`header\nparagraph`);
  });

  test('given ul string should return ul formatted', () => {
    const parsed = parser.parseHtmlToText('<ul><li>item</li></ul>');
    expect(parsed).toBe(` * item`);
  });

  test('given ul nested string should return ul formatted', () => {
    const parsed = parser.parseHtmlToText('<ul><li>item</li><li><ul><li>item</li></ul></li></ul>');
    expect(parsed).toBe(` * item\n * * item`);
  });
});
