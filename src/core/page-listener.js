function PageListener() {
  const triggerKey = '/';
  let currentKey = {};
  let stream = '';

  const onKeyPressed = (key) => {
    currentKey = key;
    if (key.key === ' ') {
      stream = '';
    }
    if (!isTriggerKey()) {
      stream += key.key;
      stream = stream.trim();
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
