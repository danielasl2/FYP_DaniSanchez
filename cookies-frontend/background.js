chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active && tab.url) {
    chrome.cookies.getAll({ url: tab.url }, function(cookies) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving cookies:', chrome.runtime.lastError);
      } else {
        console.log(cookies);
      }
    });
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getCookies" && request.data && request.data.url) {
    chrome.cookies.getAll({ url: request.data.url }, function(cookies) {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ cookies });
      }
    });
    return true;
  }
});
