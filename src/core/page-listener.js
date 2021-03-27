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

  const buildCurrentWord = async (event) => {
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

  const getShortcode = (text) => {
    const textParts = text.split(' ');
    const shortcodeWithTriggerKey = textParts[textParts.length - 1];
    return shortcodeWithTriggerKey.replace(triggerKey, '');
  };

  const replace = async (element) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    const foundShortcode = getShortcode(element.value);
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
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
    buildCurrentWord,
    isTriggerKey,
    getShortcode,
    replace,
    clearCurrentWord,
  };
}

export default {
  PageListener,
};
