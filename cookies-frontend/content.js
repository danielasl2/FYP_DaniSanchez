let cookies = document.cookie;

chrome.runtime.sendMessage({action: "getCookies", data: {url: window.location.href}}, function(response) {
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "displayCookies") {
    }
  });