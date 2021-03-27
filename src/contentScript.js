// import parser from '../src/core/parser';
import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener({ cfg });

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
document.addEventListener('keyup', async (event) => {
  listener.onKeyPressed(event);
  console.log('key pressed 1', event);
  if (listener.isTriggerKey()) {
    // TODO: replace only if a shortcode is found
    // console.log('value', event.target.value);
    const elem = await listener.replace(event.target);
    // console.log('elem', elem);
    event.target.value = elem.value;
  }
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function(response) {
  console.log('Response: ', response);
  // parser.parseHtml();
});
