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
  let currentKey;
  let currentWord = '';

  const buildCurrentWord = async (event) => {
    currentKey = event.data;
    if (event.data === ' ') {
      currentWord = '';
    }
    if (!isTriggerKey()) {
      currentWord += event.data;
      currentWord = currentWord.trim();
    }
  };

  const isTriggerKey = () => {
    if (currentKey === triggerKey) {
      return true;
    }
    return false;
  };

  const getCaretCharacterOffsetWithin = (element) => {
    let caretOffset = 0;
    let doc = element.ownerDocument || element.document;
    let win = doc.defaultView || doc.parentWindow;
    let sel;
    if (typeof win.getSelection != 'undefined') {
      sel = win.getSelection();
      if (sel.rangeCount > 0) {
        let range = win.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      let textRange = sel.createRange();
      let preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  };

  const getShortcode = (text) => {
    const textParts = text.split(' ');
    const shortcodeWithTriggerKey = textParts[textParts.length - 1];
    return shortcodeWithTriggerKey.replace(triggerKey, '');
  };

  // TODO aqui voy, refactor esto que los metodos hacen todo lo mismo y estan feos
  const replaceHtml = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.innerHTML === undefined) {
      return Promise.resolve(element);
    }

    // console.log('caret position', pos);
    let prevText = element.innerHTML;
    let nextText = '';
    if (oneIndexCaretPosition >= 0) {
      prevText = element.innerHTML.slice(0, oneIndexCaretPosition);
      nextText = element.innerHTML.slice(oneIndexCaretPosition, element.innerHTML.length);
    }
    // console.log('prev', prevText);
    // console.log('next', nextText);

    // console.log('text', element.innerHTML);
    const foundShortcode = getShortcode(parser.parseHtmlToText(prevText));
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    // console.log('foundSnippet', foundSnippet);
    if (foundSnippet) {
      // console.log('replace', element.innerHTML, foundSnippet.shortcode + triggerKey);
      let tempText = prevText.replace(foundSnippet.shortcode + triggerKey, foundSnippet.text);
      element.innerHTML = tempText + nextText;
    }
    clearCurrentWord();
    // console.log('outer', element.outerHTML);
    return Promise.resolve(element);
  };

  const replacePlainText = async (element) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    const text = element.value;
    // console.log('text', text);
    const foundShortcode = getShortcode(text);
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    // console.log('foundSnippet', foundSnippet, text);
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
    replaceHtml,
    replacePlainText,
    clearCurrentWord,
    getCaretCharacterOffsetWithin,
  };
}

export default {
  PageListener,
};
