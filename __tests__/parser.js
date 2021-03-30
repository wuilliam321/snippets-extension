import parser from '../src/core/parser';

describe('Parser', () => {
  // TODO need a detectFormatFor(element) to detect available format for it
  // html or text or some other, and then parse(format)
  // parse(format) should call parseStringHtml or parseStringHtmlToText

  // parseTextToHtml

  test('given no content, should return empty string', () => {
    const parsed = parser.parseTextToHtml();
    expect(parsed).toBe('');
  });
});
