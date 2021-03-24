import parser from '../src/core/parser';

describe('Parser', () => {
  test('given no content, should return empty string', () => {
    const parsed = parser.parseHtml();
    expect(parsed).toBe('');
  });

  test('given partially valid html should return a correct fragment', () => {
    const parsed = parser.parseHtml('<b>test');
    const element = new DocumentFragment();
    const child = document.createElement('b');
    child.textContent = 'test';
    element.append(child)
    expect(parsed).toEqual(element);
  });

  test('given plain test should return what', () => {
    const parsed = parser.parseHtml('test');
    const element = new DocumentFragment();
    element.textContent = 'test';
    expect(parsed).toEqual(element);
  });
});
