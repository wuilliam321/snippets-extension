chrome.runtime.onInstalled.addListener(() => {
  console.log('Welcome');
});
// console.log('bac.js');
// chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
//     console.log("Received %o from %o, frame", msg, sender.tab, sender.frameId);
//     sendResponse("esto es desde bg");
// });
