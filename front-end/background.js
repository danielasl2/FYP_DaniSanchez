chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

    if (changeInfo.status === 'complete' && tab.active) {

      chrome.cookies.getAll({ url: tab.url }, (cookies) => {

        console.log(cookies);

      });
    }
  });