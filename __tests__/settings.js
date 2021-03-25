import settings from '../src/core/settings';

describe('Settings', () => {
  test('given no shortcode should return -1', () => {
    const snippet = settings.getSnippetByShortcode('');
    expect(snippet).toBe(-1); // not found
  });

});
