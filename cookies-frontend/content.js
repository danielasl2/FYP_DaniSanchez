chrome.runtime.sendMessage({ action: "getCookies", data: { url: window.location.href }}, function(response) {
  if (response && response.cookies) {
    console.log("Cookies:", response.cookies);
  } else if (response && response.error) {
    console.error("Error:", response.error);
  }
});
