import axios from 'axios';
import pageListener from '../src/core/page-listener';
import Settings from '../src/core/settings';
import Storage from '../src/core/storage';
import Api from '../src/core/api';

// https://stackoverflow.com/a/9439525

// TODO: maybe all this info could be provided throuh background js and keep it small
axios.interceptors.request.use(async (config) => {
  const { auth } = await store.get('auth');
  if (auth) {
    config.headers.Authorization = auth.token_type + ' ' + auth.access_token;
  }
  return config;
});

const store = Storage({ service: chrome.storage.sync });
const api = Api({ http: axios });
const cfg = Settings({ store, api });
const listener = pageListener.PageListener(cfg);

const replaceValue = async (event) => {
  const [element] = event.path;
  console.log('element', element);
  const editable = element.hasAttribute('contenteditable');
  if (editable) {
    const pos = listener.getCaretCharacterOffsetWithin(element);
    console.log('pos', pos);
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

document.addEventListener('keyup', replaceValue, true);

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});
