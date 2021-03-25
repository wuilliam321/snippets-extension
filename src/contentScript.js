// import parser from '../src/core/parser';
import pageListener from '../src/core/page-listener';

const listener = pageListener.PageListener();

const shortcode = 'grt';
let stream = '';
const trigger_key = '/';

// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
document.addEventListener('keyup', (event) => {
  listener.onKeyPressed(event);
  console.log('key pressed 1', event);
  console.log(listener.isTriggerKey(), listener.shortcode(), listener.shortcode() === shortcode);
  if (listener.isTriggerKey()) {
    event.target.value = listener.replace(event.target.value, shortcode, 'esto es mi replacement');
    console.log('has encontrado un shortcode', listener.shortcode(), event.target.value);
  }
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  // parser.parseHtml();
});
