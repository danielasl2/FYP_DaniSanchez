document.getElementById('showCookies').addEventListener('click', async function() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const currentTab = tabs[0];
    const cookies = await chrome.cookies.getAll({ url: currentTab.url });

    displayCookies(cookies);
  } catch (error) {
    console.error("Error:", error);
  }
});

function displayCookies(cookies) {
  var cookieList = document.getElementById('listAllCookies');
  var htmlString = '<h2>Cookies:</h2>';

  if (cookies.length === 0) {
    htmlString += '<p>No cookies found.</p>';
  } else {
    htmlString += cookies.map(function(cookie) {
      return `<p><strong>${cookie.name}:</strong> ${cookie.value}</p>`;
    }).join('');
  }

  cookieList.innerHTML = htmlString;
}




