let cookies = document.cookie;

chrome.runtime.sendMessage({action: "getCookies", data: {url: window.location.href}}, function(response) {

  if (response.cookies) {

    console.log("Cookies:", response.cookies);
  }
});
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "displayCookies") {
    }
  });