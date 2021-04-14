import parser from './parser';

if (!String.prototype.replaceLast) {
  String.prototype.replaceLast = function (find, replace) {
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

  const getShortcode = async (text) => {
    try {
      const snippetsMap = await cfg.getMapSnippets();
      const textParts = text.split(/(\s+)/);
      const shortcodeWithTriggerKey = textParts[textParts.length - 1];
      if (snippetsMap[shortcodeWithTriggerKey] !== undefined) {
        return shortcodeWithTriggerKey.replace('/', '');
      }
      return '';
    } catch (err) {
      throw err;
    }
  };

  function pasteHtmlAtCaret(html) {
    let sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        const el = document.createElement('span');
        el.innerHTML = html;
        let frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if (document.selection && document.selection.type != 'Control') {
      document.selection.createRange().pasteHTML(html);
    }
  }

  const selectShortcode = (txt) => {
    let sel = window.getSelection();
    let range = new Range();

    range.setStart(sel.focusNode, sel.focusOffset - txt.length);
    range.setEnd(sel.focusNode, sel.focusOffset);

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
  };

  const pasteTextAtCaret = (el, sc, newText) => {
    const start = el.selectionStart;
    const text = el.value;
    let before = text.substring(0, start);
    const after = text.substring(start, text.length);
    before = before.replaceLast(sc, '');
    el.value = before + newText + after;
    el.selectionStart = el.selectionEnd = start + newText.length - sc.length;
    el.focus();
  };

  const findShortcode = () => {
    let wordParts = [];
    let sel = window.getSelection();
    let range = new Range();
    const originalOffset = sel.focusOffset;
    for (let i = sel.focusOffset; i >= 1; i--) {
      range.setStart(sel.focusNode, i - 1);
      range.setEnd(sel.focusNode, i);
      const currentChar = range.cloneContents().textContent;
      if (currentChar === ' ') {
        break;
      }
      wordParts.push(currentChar);
    }
    range.setStart(sel.focusNode, originalOffset);
    range.setEnd(sel.focusNode, originalOffset);

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    return wordParts.reverse().join('');
  };

  const replaceHtml = async (element, oneIndexCaretPosition) => {
    try {
      if (!element) {
        throw new Error('element is required');
      }
      if (element.innerHTML === undefined) {
        return element;
      }
      if (!oneIndexCaretPosition) {
        oneIndexCaretPosition = 0;
      }

      const shortcodeText = findShortcode();
      const foundShortcode = await getShortcode(shortcodeText);
      const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
      if (foundSnippet === -1) {
        return element;
      }
      selectShortcode(shortcodeText);
      pasteHtmlAtCaret(foundSnippet.text);
      return element;
    } catch (err) {
      throw err;
    }
  };

  const replacePlainText = async (element, oneIndexCaretPosition) => {
    try {
      if (!element) {
        throw new Error('element is required');
      }
      if (element.value === undefined) {
        return element;
      }
      if (!oneIndexCaretPosition) {
        oneIndexCaretPosition = 0;
      }

      let prevText = element.value;
      const offset = oneIndexCaretPosition;
      if (offset > 0) {
        prevText = element.value.slice(0, offset);
      }

      const foundShortcode = await getShortcode(prevText);
      const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
      if (foundSnippet === -1) {
        return element;
      }
      pasteTextAtCaret(
        element,
        foundShortcode + triggerKey,
        parser.parseHtmlToText(foundSnippet.text),
      );
      return element;
    } catch (err) {
      throw err;
    }
  };

  return {
    isTriggerKey,
    getShortcode,
    replaceHtml,
    replacePlainText,
    getCaretCharacterOffsetWithin,
    pasteHtmlAtCaret,
  };
}

export default {
  PageListener,
};
