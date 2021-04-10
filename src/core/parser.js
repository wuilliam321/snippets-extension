import { htmlToText } from 'html-to-text';
const OPTIONS = {
  tags: {
    'blockquote': {
      format: 'blockquote',
      options: { leadingLineBreaks: 1, trailingLineBreaks: 0, trimEmptyLines: true }
    },
    'h1': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'h2': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'h3': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'h4': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'h5': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'h6': { format: 'heading', options: { leadingLineBreaks: 1, trailingLineBreaks: 1, uppercase: false } },
    'hr': { format: 'horizontalLine', options: { leadingLineBreaks: 1, length: undefined, trailingLineBreaks: 1 } },
    'ol': { format: 'orderedList', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    'p': { format: 'paragraph', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    'pre': { format: 'pre', options: { leadingLineBreaks: 1, trailingLineBreaks: 1 } },
    'ul': {
      options: { itemPrefix: ' * ', leadingLineBreaks: 1, trailingLineBreaks: 1 }
    },
  },
  wordwrap: null
};

function Parser() {
  const createTemplateFromHTML = (htmlText) => {
    const el = document.createElement('div');
    el.innerHTML = htmlText;
    return el;
  };

  const parseTextToHtml = (htmlText) => {
    if (!htmlText) {
      // TODO: not tested, what if no html
      return '';
    }

    const el = createTemplateFromHTML(htmlText);
    return el;
  };

  const parseHtmlToText = (html) => {
    return htmlToText(html, OPTIONS);
  };

  return {
    parseTextToHtml,
    parseHtmlToText,
  };
}

export default Parser();
