chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.create({ url: "https://app.capijzo.com/register" });
});