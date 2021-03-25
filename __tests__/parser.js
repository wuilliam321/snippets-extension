import parser from '../src/core/parser';

describe('Parser', () => {
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
    element.append(child)
    expect(parsed).toEqual(element);
  });

  test('given plain test should return a fragment with plain text on it', () => {
    const parsed = parser.parseHtml('test');
    const element = new DocumentFragment();
    element.textContent = 'test';
    expect(parsed).toEqual(element);
  });
});
