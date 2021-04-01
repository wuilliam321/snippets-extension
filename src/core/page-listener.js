import parser from './parser';

function PageListener(cfg) {
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

  // https://jsfiddle.net/TjXEG/900/
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
        // console.log('preCaretRange 1', preCaretRange);
        caretOffset = preCaretRange.toString().length;
      }
    } else if ((sel = doc.selection) && sel.type != 'Control') {
      let textRange = sel.createRange();
      let preCaretTextRange = doc.body.createTextRange();
      preCaretTextRange.moveToElementText(element);
      preCaretTextRange.setEndPoint('EndToEnd', textRange);
      // console.log('preCaretRange 2', preCaretRange.text);
      caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
  };

  const getShortcode = (text) => {
    const textParts = text.split(/(\s+)/);
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

    // console.log('element.textContent', element.textContent);
    let prevText = element.textContent;
    if (oneIndexCaretPosition > 0) {
      prevText = element.textContent.slice(0, oneIndexCaretPosition);
    }
    // console.log('prev', prevText, parser.parseTextToHtml(prevText));
    // console.log('next', nextText);

    const foundShortcode = getShortcode(prevText);
    // TODO: move cfg dependecy out of here
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    //
    // TODO aqui voy algo da -1 no se que es (tiene que ver con los content edible
    // aquuiiiiii
    // console.log('foundSnippet', foundSnippet);
    if (foundSnippet !== -1) {
      // console.log('replace', element.innerHTML, foundSnippet.shortcode + triggerKey);
      const tempText = element.innerHTML.replace(
        foundSnippet.shortcode + triggerKey,
        foundSnippet.text,
      );
      element.innerHTML = tempText;
    }
    clearCurrentWord();
    // console.log('outer', element.outerHTML);
    return Promise.resolve(element);
  };

  const replacePlainText = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    let prevText = element.value;
    let nextText = '';
    if (oneIndexCaretPosition > 0) {
      prevText = element.value.slice(0, oneIndexCaretPosition);
      nextText = element.value.slice(oneIndexCaretPosition, element.value.length);
    }

    // console.log('text', text);
    const foundShortcode = getShortcode(prevText);
    // TODO: move cfg dependecy out of here
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    // console.log('foundSnippet', foundSnippet, text);
    if (foundSnippet !== -1) {
      const tempText = prevText.replace(
        foundSnippet.shortcode + triggerKey,
        parser.parseHtmlToText(foundSnippet.text),
      );
      element.value = tempText + nextText;
    }
    clearCurrentWord();
    return Promise.resolve(element);
  };

  const clearCurrentWord = () => {
    currentWord = '';
  };

  const inputListener = async (event) => {
    console.log('inputListener called', event.path);
    await buildCurrentWord(event);
    console.log('input', event);
    const [element] = event.path;
    const element = event.path[0];
    const editable = element.hasAttribute('contenteditable');
    if (editable) {
      console.log('not editable here', event);
      if (isTriggerKey()) {
        // console.log('editable html', element.innerHTML);
        // TODO: need a refactor here first, too repetitive code
        // TODO: i need a way to detect if the word is only the trigger, do not replace anything
        // TODO: replace only if a shortcode is found
        const pos = getCaretCharacterOffsetWithin(element);
        // console.log('pos editable', pos);
        const result = await replaceHtml(element, pos);
        element.innerHTML = result.innerHTML;
      }
    } else {
      console.log('not editable here', event);
      if (isTriggerKey()) {
        // console.log('value', element.value);
        // TODO: i need a way to detect if the word is only the trigger, do not replace anything
        // TODO: replace only if a shortcode is found
        const pos = getCaretCharacterOffsetWithin(element);
        // console.log('pos input', pos);
        const elem = await replacePlainText(element, pos);
        element.value = elem.value;
      }
    }
    console.log('outer', element.outerHTML);
  };

  return {
    buildCurrentWord,
    isTriggerKey,
    getShortcode,
    replaceHtml,
    replacePlainText,
    clearCurrentWord,
    getCaretCharacterOffsetWithin,
    inputListener,
  };
}

export default {
  PageListener,
};
