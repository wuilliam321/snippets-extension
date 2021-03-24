import parser from '../src/core/parser';

const shortcode = 'grt/';
let stream = '';
const trigger_key = '/';

document.addEventListener('keydown', (event) => {
  console.log('key pressed', event);

  if (event.key === ' ') {
    stream = '';
  }

  stream = stream + event.key;
  stream = stream.trim();

  console.log(shortcode, stream);

  if (event.key === '/' && shortcode === stream) {
    console.log('has encontrado un shortcode');
  }
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function (response) {
  console.log('Response: ', response);
  parser.parseHtml();
});
