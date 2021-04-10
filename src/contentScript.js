import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener(cfg);

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???

const inputEvent = (event) => {
  console.log('input', event);
};

const replaceValue = async (event) => {
  const [element] = event.path;
  const editable = element.hasAttribute('contenteditable');
  if (editable) {
    const pos = listener.getCaretCharacterOffsetWithin(element);
    console.log('editable pos', pos);
    if (listener.isTriggerKey(event.key)) {
      const result = await listener.replaceHtml(element, pos);
      if (result) {
        // element.innerHTML = result.innerHTML;
        element.dispatchEvent(new InputEvent('input', { data: 'a', bubbles: true }));
      }
    }
  } else {
    const pos = element.selectionEnd;
    console.log('pos', pos);
    if (listener.isTriggerKey(event.key)) {
      const result = await listener.replacePlainText(element, pos);
      if (result) {
        // element.value = result.value;
        element.dispatchEvent(new InputEvent('input', { data: 'a', bubbles: true }));
      }
    }
  }
};

document.addEventListener('keyup', replaceValue);
document.addEventListener('input', inputEvent);

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});
