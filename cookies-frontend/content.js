chrome.runtime.sendMessage({ action: "getCookies", data: { url: window.location.href }}, (response) => {
  if (response && response.data) {
    console.log("Cookies:", response.data);
  } else if (response && response.error) {
    console.error("Error:", response.error);
  }
});