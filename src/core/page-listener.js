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
  let stream = '';

  // const handleReplace = () => {};

  const onKeyPressed = async (event) => {
    // console.log('onKeyPressed', event.target.value);
    currentKey = event;
    if (event.key === ' ') {
      stream = '';
    }
    if (!isTriggerKey()) {
      stream += event.key;
      stream = stream.trim();
    }

    // handleReplace();
    if (isTriggerKey()) {
      // const snippet = await cfg.getSnippetByShortcode(shortcode());
      // // event.target.value = parser.parseHtmlToText(snippet.text);
      // console.log('going to replace onKeyPressed');
      // console.log('going to replace onKeyPressed value', event.target.value);
      // event.target.value = replace(
      //   event.target.value,
      //   shortcode(),
      //   parser.parseHtmlToText(snippet.text),
      // );
      // console.log('going to replace onKeyPressed value after', event.target.value);
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
      return stream;
    }
    return '';
  };

  const findShortCode = (text) => {
    const textParts = text.split(' ');
    const shortcodeWithTriggerKey = textParts[textParts.length - 1];
    const shortcode = shortcodeWithTriggerKey.replace(triggerKey, '')
    return shortcode;
  }

  const replace = async (element) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    const shortcode = findShortCode(element.value);
    // console.log('shortcode', shortcode);
    // console.log('all', await cfg.getSnippets());
    const foundSnippet = await cfg.getSnippetByShortcode(shortcode);
    // console.log('foundSnippet', foundSnippet);
    if (foundSnippet) {
      element.value = element.value.replace(
        foundSnippet.shortcode + triggerKey,
        parser.parseHtmlToText(foundSnippet.text),
      );
    }
    return Promise.resolve(element);
  };

  return {
    onKeyPressed,
    isTriggerKey,
    shortcode,
    replace,
  };
}

export default {
  PageListener,
};
