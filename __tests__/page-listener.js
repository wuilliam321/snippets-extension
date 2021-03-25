import pageListener from '../src/core/page-listener';

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

  test('find shortcode', () => {
    const shortcode = 'aa';
    const replacement = 'test test';
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.value = 'aa/';
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    // TODO add more cases to this replace
    elem.value = listener.replace(elem.value, shortcode, replacement);
    expect(listener.shortcode()).toBe(shortcode);
    expect(elem.value).toBe(replacement);
  });
});
