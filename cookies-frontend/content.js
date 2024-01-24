chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "displayCookies") {
    console.log("Received cookies in content script:", message.data.cookies); 

    fetch('http://localhost:3000/api/cookies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cookies: message.data.cookies })
    })
    .then(response => response.json())
    .then(data => console.log("Response from server:", data)) 
    .catch(error => console.error('Error:', error));

    window.postMessage({ type: "FROM_EXTENSION", action: "displayCookies", data: message.data }, "*");
  }
});

chrome.runtime.sendMessage({ action: "contentScriptReady" });

