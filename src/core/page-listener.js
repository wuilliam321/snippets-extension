import parser from './parser';
import settings from './settings';

function PageListener() {
  const triggerKey = '/';
  let currentKey = {};
  let stream = '';

  // const handleReplace = () => {};

  const onKeyPressed = (event) => {
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
      const snippet = settings.getSnippetByShortcode(shortcode());
      event.target.value = parser.parseHtmlToText(snippet.text);
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

  const replace = (text, shortcode, replacement) => {
    console.log('going to replace', text, shortcode + triggerKey, replacement);
    return text.replace(shortcode + triggerKey, replacement);
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
