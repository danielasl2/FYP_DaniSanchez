chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {

    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving cookies:', chrome.runtime.lastError);
      } else {
        chrome.runtime.sendMessage({ action: "displayCookies", data: { cookies } });
      }
    });
  }
});



/*
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.active && tab.url) {
    chrome.cookies.getAll({ url: tab.url }, function(cookies) {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving cookies:', chrome.runtime.lastError);
      } else {
        fetch('http://localhost:3000/api/cookies', {
          method:'POST',
          headers:{ 'Content-Type': 'application/json',},
          body: JSON.stringify({cookies}),
        })
        .then(response => {
          if (!response.ok){
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json()
        })
        .then(data => console.log(data))
        .catch(error => console.log('Error: ', error));
      }
    });
  }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies" && request.data && request.data.url) {
    chrome.cookies.getAll({ url: request.data.url }, (cookies) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
        return; 
      }

      fetch('http://localhost:3000/api/cookies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookies })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        sendResponse({ data }); 
      })
      .catch(error => {
        console.log('Error:', error);
        sendResponse({ error: error.message }); 
      });
    });
    return true; 
  }
});
*/
/*
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    chrome.cookies.getAll({ url: tab.url }, (cookies) => {
      if (chrome.runtime.lastError) {
        console.error('Error retrieving cookies:', chrome.runtime.lastError);
      } else {
        chrome.runtime.sendMessage({ action: "cookiesFetched", data: { cookies } });
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getCookies" && request.data && request.data.url) {
    chrome.cookies.getAll({ url: request.data.url }, (cookies) => {
      if (chrome.runtime.lastError) {
        sendResponse({ error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ cookies });
      }
    });
    return true;
  }
});
*/

