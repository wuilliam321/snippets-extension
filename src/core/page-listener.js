import parser from './parser';

if (!String.prototype.replaceLast) {
    String.prototype.replaceLast = function(find, replace) {
        var index = this.lastIndexOf(find);

        if (index >= 0) {
            return this.substring(0, index) + replace + this.substring(index + find.length);
        }

        return this.toString();
    };
}

function PageListener(cfg) {
  const triggerKey = '/';

  const isTriggerKey = (key) => {
    if (key === triggerKey) {
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

  const getPossibleShortcodes = (text) => {
    let parts = text.split(/(\s+)/);
    parts = parts.filter((p) => (p.trim() && p.length > 0) || p.indexOf(triggerKey) !== -1);
    return parts;
  };

  const getShortcode = async (text) => {
    const snippetsMap = await cfg.getMapSnippets();
    const textParts = text.split(/(\s+)/);
    const shortcodeWithTriggerKey = textParts[textParts.length - 1];
    if (snippetsMap[shortcodeWithTriggerKey] !== undefined) {
      return Promise.resolve(shortcodeWithTriggerKey.replace('/', ''));
    }
    return Promise.resolve('');

    // const snippetsMap = await cfg.getMapSnippets();
    // const possibleShortcodes = getPossibleShortcodes(text);
    // for (let i = 0; i <= possibleShortcodes.length; i++) {
    //   if (snippetsMap[possibleShortcodes[i]] !== undefined) {
    //     return possibleShortcodes[i].replace('/', '');
    //   }
    // }
    // return '';
  };

  // TODO aqui voy, refactor esto que los metodos hacen todo lo mismo y estan feos
  const replaceHtml = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.innerHTML === undefined) {
      return Promise.resolve(element);
    }

    //console.log('editable pos', oneIndexCaretPosition);
    //console.log('editable element.innerText', element.innerText);
    //console.log('editable element.innerHTML', element.innerHTML);
    let prevText = element.innerText;
    if (oneIndexCaretPosition > 0) {
      prevText = element.innerText.slice(0, oneIndexCaretPosition);
    }
    //console.log('prev', prevText, parser.parseTextToHtml(prevText));

    const foundShortcode = await getShortcode(prevText);
    // TODO: move cfg dependecy out of here
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    //
    // TODO aqui voy algo da -1 no se que es (tiene que ver con los content edible
    // aquuiiiiii
    //console.log('foundSnippet', foundSnippet);
    if (foundSnippet === -1) {
      return Promise.resolve(element);
    }
    const tempText = element.innerHTML.replaceLast(
      foundSnippet.shortcode + triggerKey,
      // parser.parseHtmlToText(foundSnippet.text), // TODO remove this parser in given websites like linked in chat messages
      foundSnippet.text,
    );
    element.innerHTML = tempText;
    return Promise.resolve(element);
  };

  const replacePlainText = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }

    //console.log('pos', oneIndexCaretPosition);
    //console.log('element.value', element.value);
    let prevText = element.value;
    let nextText = '';
    // const blankSpaces = element.value.match(/\n/g).length;
    const blankSpaces = 0;
    const offset = oneIndexCaretPosition + blankSpaces;
    console.log('offset', offset);
    if (offset > 0) {
      prevText = element.value.slice(0, offset);
      nextText = element.value.slice(offset, element.value.length);
    }
    console.log('prevText', prevText);

    const foundShortcode = await getShortcode(prevText);
    // TODO: move cfg dependecy out of here
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    if (foundSnippet === -1) {
      return Promise.resolve(element);
    }
    // todo aqui vay con lo del replace
    const tempText = prevText.replaceLast(
      foundSnippet.shortcode + triggerKey,
      parser.parseHtmlToText(foundSnippet.text),
    );
    element.value = tempText + nextText;
    return Promise.resolve(element);
  };

  return {
    isTriggerKey,
    getShortcode,
    replaceHtml,
    replacePlainText,
    getCaretCharacterOffsetWithin,
  };
}

export default {
  PageListener,
};
