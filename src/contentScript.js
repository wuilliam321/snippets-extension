import axios from 'axios';
import pageListener from '../src/core/page-listener';
import Settings from '../src/core/settings';
import Storage from '../src/core/storage';
import Api from '../src/core/api';

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

const openWindow = (event, source) => {
  const body = event.path.filter((e) => e instanceof HTMLBodyElement);
  console.log('open', body, source, event.path);
  if (body.length) {
    const dialog = document.createElement('div');
    dialog.setAttribute(
      'style',
      'z-index: 90000;   margin: auto; position: absolute; top: 0; left: 0; bottom: 0; right: 0; width: 200px; height: 200px; background-color: blue;',
    );
    dialog.innerText = 'test';
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://www.w3schools.com');
    iframe.setAttribute('width', '200px');
    iframe.setAttribute('height', '200px');
    dialog.append(iframe);
    body[0].append(dialog);
  }
};

const replaceValue = async (event) => {
  const [element] = event.path;
  console.log('element', element);
  const editable = element.hasAttribute('contenteditable');
  if (editable) {
    const pos = listener.getCaretCharacterOffsetWithin(element);
    console.log('pos', pos);
    if (listener.isTriggerKey(event.key)) {
      // openWindow(event, 'editable');
      const result = await listener.replaceHtml(element, pos);
      if (result) {
        element.dispatchEvent(new InputEvent('input', { data: ' ', bubbles: true }));
      }
    }
  } else {
    const pos = element.selectionEnd;
    console.log('pos', pos);
    if (listener.isTriggerKey(event.key)) {
      // openWindow(event, 'textarea');
      const result = await listener.replacePlainText(element, pos);
      if (result) {
        element.dispatchEvent(new InputEvent('input', { data: ' ', bubbles: true }));
      }
    }
  }
};
document.addEventListener('keyup', replaceValue, true);

// https://stackoverflow.com/a/9439525
// TODO: Try this to verify if performance is affected
// (function checkForNewIframe(doc) {
//     if (!doc) return; // document does not exist. Cya
//     doc.addEventListener('keyup', replaceValue, true);
//     doc.hasSeenDocument = true;
//     for (var i = 0, contentDocument; i<frames.length; i++) {
//         try {
//             contentDocument = iframes[i].document;
//         } catch (e) {
//             continue; // Same-origin policy violation?
//         }
//         if (contentDocument && !contentDocument.hasSeenDocument) {
//             // Add poller to the new iframe
//             checkForNewIframe(iframes[i].contentDocument);
//         }
//     }
//     setTimeout(checkForNewIframe, 250, doc); // <-- delay of 1/4 second
// })(document); // Initiate recursive function for the document.

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseTextToHtml();
});

fetch(chrome.runtime.getURL('/dialog.html')).then(r => r.text()).then(html => {
  document.body.insertAdjacentHTML('beforeend', html);
  // aqui voy, intentando injectar un html, y luego levantar una vue app ahi, sera posible?
  // not using innerHTML as it would break js event listeners of the page
});
