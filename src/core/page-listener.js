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
  function pasteHtmlAtCaret(html, parent) {
    let sel, range;
    if (window.getSelection) {
      // IE9 and non-IE
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        // Range.createContextualFragment() would be useful here but is
        // non-standard and not supported in all browsers (IE9, for one)
        // const frag = parser.parseTextToHtml(html)
        const el = document.createElement('span');
        el.innerHTML = html;
        let frag = document.createDocumentFragment();
        let node;
        let lastNode;
        while ((node = el.firstChild)) {
          lastNode = frag.appendChild(node);
        }
        range.insertNode(frag);

        // Preserve the selection
        if (lastNode) {
          range = range.cloneRange();
          range.setStartAfter(lastNode);
          range.collapse(true);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    } else if (document.selection && document.selection.type != 'Control') {
      // IE < 9
      document.selection.createRange().pasteHTML(html);
    }
  }
  const selectShortcode = (txt) => {
    // let range = document.createRange();
    // range.setStart(element.childNodes[0].firstChild, from); // 7 is the length of "this is"
    // range.setEnd(element.childNodes[0].firstChild, to); // 7 is the length of "this is"
    // range.deleteContents();
    // let sel = window.getSelection();
    // sel.removeAllRanges();
    // sel.addRange(range);
    let sel = window.getSelection();
    let range = new Range();

    range.setStart(sel.focusNode, sel.focusOffset - txt.length);
    range.setEnd(sel.focusNode, sel.focusOffset);

    // apply the selection, explained later below
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    // console.log('content', range.extractContents());

    // let sel, range;
    // if (window.getSelection) {
    // IE9 and non-IE
    // sel = window.getSelection();
    // if (sel.getRangeAt && sel.rangeCount) {
    //   range = sel.getRangeAt(0);
    //   range.deleteContents();

    //   console.log('end', range);
    //   range.setStart(range.endContainer, range.startOffset - txt.length);
    //   range.setEnd(range.endContainer, range.startOffset);
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    //   console.log('content', range.extractContents());

    // // Range.createContextualFragment() would be useful here but is
    // // non-standard and not supported in all browsers (IE9, for one)
    // // const frag = parser.parseTextToHtml(html)
    // const el = document.createElement('span');
    // el.innerHTML = html;
    // let frag = document.createDocumentFragment();
    // let node;
    // let lastNode;
    // while ((node = el.firstChild)) {
    //   lastNode = frag.appendChild(node);
    // }
    // range.insertNode(frag);

    // // Preserve the selection
    // if (lastNode) {
    //   range = range.cloneRange();
    //   range.setStartAfter(lastNode);
    //   range.collapse(true);
    //   sel.removeAllRanges();
    //   sel.addRange(range);
    // }
    // }
    // } else if (document.selection && document.selection.type != 'Control') {
    //   // IE < 9
    //   // document.selection.createRange().pasteHTML(html);
    // }
  };

  const zapato = () => {
    let txt = [];
    let sel = window.getSelection();
    let range = new Range();

    console.log('txt', sel.focusOffset);
    const originalOffset = sel.focusOffset;

    for (let i = sel.focusOffset; i >= 1; i--) {
      console.log('offset', sel.focusOffset, i - 1, i);

      range.setStart(sel.focusNode, i - 1); // 7 is the length of "this is"
      range.setEnd(sel.focusNode, i); // 7 is the length of "this is"
      const theChar = range.cloneContents().textContent;
      if (theChar === ' ') {
        break;
      }
      txt.push(theChar);
    }
    range.setStart(sel.focusNode, originalOffset); // 7 is the length of "this is"
    range.setEnd(sel.focusNode, originalOffset); // 7 is the length of "this is"

    // range.setStart(sel.focusNode, sel.focusOffset - txt.length);
    // range.setEnd(sel.focusNode, sel.focusOffset);

    // apply the selection, explained later below
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    console.log('txt', txt);
    return txt.reverse().join('');
    // TODO, ver como mover from current to prev usonde currentnode textNode = sel.focusNode https://stackoverflow.com/a/10782169
    // let txt = '';
    // let point = pos;
    // let range = document.createRange();
    // console.log('zapato element', element);
    // for (let i = pos; i >= 1; i--) {
    //   range.setStart(element.childNodes[0].firstChild, i - 1); // 7 is the length of "this is"
    //   range.setEnd(element.childNodes[0].firstChild, i); // 7 is the length of "this is"
    //   const theChar = range.cloneContents().textContent;
    //   if (theChar === ' ') {
    //     point = i;
    //     break;
    //   }
    //   txt += theChar;
    // }
    // let sel = window.getSelection();
    // sel.removeAllRanges();
    // sel.addRange(range);
    // range.setStart(element.childNodes[0].firstChild, pos); // 7 is the length of "this is"
    // range.setEnd(element.childNodes[0].firstChild, pos); // 7 is the length of "this is"
    // return [txt.split('').reverse().join(''), point, pos];
  };

  // TODO aqui voy, refactor esto que los metodos hacen todo lo mismo y estan feos
  const replaceHtml = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.innerHTML === undefined) {
      return Promise.resolve(element);
    }
    if (!oneIndexCaretPosition) {
      oneIndexCaretPosition = 0;
    }

    //console.log('editable pos', oneIndexCaretPosition);
    console.log('editable element.innerText', element.innerText);
    console.log('editable element.innerHTML', element.innerHTML);
    // let blankSpaces = 0;
    // const matches = element.innerText.match(/\n/g);
    // if (matches && matches.length) {
    //   blankSpaces = matches.length;
    // }
    // // const offset = oneIndexCaretPosition + blankSpaces;
    // const offset = oneIndexCaretPosition;
    // console.log('blankSpaces', blankSpaces);
    // let prevText = element.innerText;
    // if (offset > 0) {
    //   prevText = element.innerText.slice(0, offset);
    // }
    // // AQUI VOY viendo que esto se divida correctamente
    // console.log('prevText', prevText, prevText.legth);

    const txt = zapato(element, oneIndexCaretPosition);
    // const txt = 'header/';
    console.log('txt', txt);
    const foundShortcode = await getShortcode(txt);
    console.log('shortcode', foundShortcode);
    // TODO: move cfg dependecy out of here
    const foundSnippet = await cfg.getSnippetByShortcode(foundShortcode);
    console.log('foundSnippet', foundSnippet);
    //
    if (foundSnippet === -1) {
      return Promise.resolve(element);
    }
    selectShortcode(txt);
    // const tempText = element.innerHTML.replaceLast(
    //   foundSnippet.shortcode + triggerKey,
    //   // parser.parseHtmlToText(foundSnippet.text), // TODO remove this parser in given websites like linked in chat messages
    //   foundSnippet.text,
    // );
    // element.innerHTML = tempText;
    pasteHtmlAtCaret(foundSnippet.text, element);
    return Promise.resolve(element);
  };

  const replacePlainText = async (element, oneIndexCaretPosition) => {
    if (!element) {
      return Promise.reject('element is required');
    }
    if (element.value === undefined) {
      return Promise.resolve(element);
    }
    if (!oneIndexCaretPosition) {
      oneIndexCaretPosition = 0;
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
