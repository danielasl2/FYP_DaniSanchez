
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action === "displayCookies") {
    console.log("Received cookies in content script:", message.data.cookies); 

    //getting the user id here
    chrome.storage.local.get('userId', (result) => {
      if(result.userId) {

        console.log("Retrived userId for API call: ", result.userId);
        const userId = result.userId;
        const cookiesWithUserId = message.data.cookies.map(cookie => ({ ...cookie, userId }));
     //   console.log('Retrived userId in content script: ', userId);

     //verigying that the user id is send with the respective cookies

    fetch('http://fyp-danisanchez.onrender.com/api/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookies: cookiesWithUserId})
    })
    .then(response => response.json())
    .then(data => console.log("Response from server:", data)) 
    .catch(error => console.error('Error:', error));
  }
  else {
    console.log("No userid found");
  }
});
    window.postMessage({ type: "FROM_EXTENSION", action: "displayCookies", data: message.data }, "*");
  }
});

// to notify background that content is ready and loaded
chrome.runtime.sendMessage({ action: "contentScriptReady", data: {necessaryData} });

