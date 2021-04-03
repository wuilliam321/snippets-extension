import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener(cfg);

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
//

// TODO maybe we need a listener for each kind of input/textarea/editable div

document.addEventListener('input', async (event) => {
  // console.log('input', event);
  // const [element] = event.path;
  const element = event.path[0];
  const editable = element.hasAttribute('contenteditable');
  if (editable) {
    const pos = listener.getCaretCharacterOffsetWithin(element);
    console.log('pos editable', pos);
    if (listener.isTriggerKey(event.data)) {
      // console.log('editable html', element.innerHTML);
      // TODO: need a refactor here first, too repetitive code
      // TODO: i need a way to detect if the word is only the trigger, do not replace anything
      // TODO: replace only if a shortcode is found
      // console.log('pos editable', pos);
      const result = await listener.replaceHtml(element, pos);
      if (result !== -1) {
        element.innerHTML = result.innerHTML;
      }
    }
  } else {
    const pos = element.selectionEnd;
    console.log('pos textarea', pos);
    if (listener.isTriggerKey(event.data)) {
      // console.log('value', element.value);
      // TODO: i need a way to detect if the word is only the trigger, do not replace anything
      // TODO: replace only if a shortcode is found
      // const pos = listener.getCaretCharacterOffsetWithin(element);
      // console.log('pos input', pos);
      const result = await listener.replacePlainText(element, pos);
      if (result !== -1) {
        element.value = result.value;
      }
    }
  }
  // console.log('outer', element.outerHTML);
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});
