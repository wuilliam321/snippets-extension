import pageListener from '../src/core/page-listener';
import parser from '../src/core/parser';

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
  test('given shorcode triggered replace textarea with parsed html to text', () => {
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

  test('given shorcode triggered replace textarea with parsed html to text', () => {
    const listener = pageListener.PageListener();
    const elem = document.createElement('textarea');
    elem.value = 'bb/'; // workaround to set a default text (while I can make it dynamically)
    elem.addEventListener('keyup', listener.onKeyPressed);
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: 'b' }));
    elem.dispatchEvent(new KeyboardEvent('keyup', { key: '/' }));
    expect(listener.isTriggerKey()).toBe(true);
    expect(elem.value).toBe(`Strike\n\nHeader 2\n\n * List\n * List Padding`);
  });

});
