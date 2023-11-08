chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {

    if (changeInfo.status === 'complete' && tab.active) {

      chrome.cookies.getAll({ url: tab.url }, function(cookies) {

        console.log(cookies);
  
      });
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getCookies") {
      chrome.cookies.getAll({url: request.data.url}, function(cookies) {
        sendResponse({cookies});
      });
      return true;  
    }
  });
  