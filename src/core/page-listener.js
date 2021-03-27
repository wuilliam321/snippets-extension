import parser from './parser';
import settings from './settings';

function PageListener(options) {
  let { cfg, store } = options;
  if (!cfg) {
    // if (!store) {
    //   store = storage();
    // }
    const store = storage();
    cfg = settings(store);
  }
  const triggerKey = '/';
  let currentKey = {};
  let currentWord = '';

  // const handleReplace = () => {};

  const onKeyPressed = async (event) => {
    currentKey = event;
    if (event.key === ' ') {
      currentWord = '';
    }
    if (!isTriggerKey()) {
      currentWord += event.key;
      currentWord = currentWord.trim();
    }
  };

  const isTriggerKey = () => {
    if (currentKey.key === triggerKey) {
      return true;
    }
    return false;
  };

  const shortcode = () => {
    if (isTriggerKey()) {
      return currentWord;
    }
    return '';
  };

  const findShortCode = (text) => {
    const textParts = text.split(' ');
    const shortcodeWithTriggerKey = textParts[textParts.length - 1];
    const shortcode = shortcodeWithTriggerKey.replace(triggerKey, '');
    return shortcode;
  };

  const replace = async (element) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    const shortcode = findShortCode(element.value);
    const foundSnippet = await cfg.getSnippetByShortcode(shortcode);
    if (foundSnippet) {
      element.value = element.value.replace(
        foundSnippet.shortcode + triggerKey,
        parser.parseHtmlToText(foundSnippet.text),
      );
    }
    clearCurrentWord();
    return Promise.resolve(element);
  };

  const clearCurrentWord = () => {
    currentWord = '';
  };

  return {
    onKeyPressed,
    isTriggerKey,
    shortcode,
    replace,
    clearCurrentWord,
  };
}

export default {
  PageListener,
};
