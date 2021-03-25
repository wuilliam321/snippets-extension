function parseHtml(content) {
  if (!content) {
    return '';
  }
  const el = document.createElement('template');
  el.innerHTML = content;
  return el.content;
}
export default {
  parseHtml,
};
