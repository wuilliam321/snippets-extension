import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener(cfg);

const replaceValue = async (event) => {
  const [element] = event.path;
  const editable = element.hasAttribute('contenteditable');
  if (editable) {
    const pos = listener.getCaretCharacterOffsetWithin(element);
    console.log('editable pos', pos);
    if (listener.isTriggerKey(event.key)) {
      const result = await listener.replaceHtml(element, pos);
      if (result) {
        element.dispatchEvent(new InputEvent('input', { data: ' ', bubbles: true }));
      }
    }
  } else {
    const pos = element.selectionEnd;
    console.log('pos', pos);
    if (listener.isTriggerKey(event.key)) {
      const result = await listener.replacePlainText(element, pos);
      if (result) {
        element.dispatchEvent(new InputEvent('input', { data: ' ', bubbles: true }));
      }
    }
  }
};

document.addEventListener('keyup', replaceValue);

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});
