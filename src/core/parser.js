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
  const createTemplateFromHTML = (html) => {
    const el = document.createElement('template');
    el.innerHTML = html;
    return el;
  };
  const parseHtml = (html) => {
    if (!html) {
      return '';
    }

    const el = createTemplateFromHTML(html);
    return el.content;
  };

  const parseHtmlToText = (html) => {
    return htmlToText(html, OPTIONS);
  };

  return {
    parseHtml,
    parseHtmlToText,
  };
}

export default Parser();
