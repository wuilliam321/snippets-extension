// import parser from '../src/core/parser';
import pageListener from '../src/core/page-listener';

const listener = pageListener.PageListener();


// TODO aqui voy tratando de capas pasar aqui un evet con callback y en el callback hacer lo que quiera con lo que consigo??? maybe???
document.addEventListener('keyup', (event) => {
    listener.onKeyPressed(event);
    console.log('key pressed 1', event);
    if (listener.isTriggerKey()) {
        listener.replace(event.target);
        console.log('has encontrado un shortcode', listener.shortcode(), event.target.value);
    }
});

chrome.runtime.sendMessage({ text: 'esto es desde cs' }, function(response) {
    console.log('Response: ', response);
    // parser.parseHtml();
});