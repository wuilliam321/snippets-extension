import parser from '../src/core/parser';

describe('Parser', () => {
  test('parseHtml should return empty if nothing passed', () => {
    const result = parser.parseHtml();
    expect(result).toBe('');
  });
});
