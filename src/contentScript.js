import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener({ cfg });

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
//

// TODO maybe we need a listener for each kind of input/textarea/editable div

document.addEventListener('input', async (event) => {
  listener.buildCurrentWord(event);
  console.log('input', event);
  // console.log('target', event.target);
  const editable = event.target.hasAttribute('contenteditable');
  if (editable) {
    if (listener.isTriggerKey()) {
      console.log('editable html', event.target.innerHTML);
      // TODO: replace only if a shortcode is found
      const pos = listener.getCaretCharacterOffsetWithin(event.target);
      const elem = await listener.replaceHtml(event.target, pos);
      event.target.innerHTML = elem.innerHTML;
    }
  } else {
    if (listener.isTriggerKey()) {
      console.log('value', event.target.value);
      // TODO: replace only if a shortcode is found
      const elem = await listener.replacePlainText(event.target);
      event.target.value = elem.value;
    }
  }
  // console.log('outer', event.target.outerHTML);
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseHtml();
});
