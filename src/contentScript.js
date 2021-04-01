import pageListener from '../src/core/page-listener';
import settings from '../src/core/settings';
import storage from '../src/core/storage';

const store = storage(chrome.storage.sync);
const cfg = settings(store);
const listener = pageListener.PageListener(cfg);

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
//

// TODO maybe we need a listener for each kind of input/textarea/editable div

document.addEventListener('input', listener.inputListener);

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});
