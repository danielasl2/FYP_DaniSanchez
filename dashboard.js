
document.getElementById('showCookies').addEventListener('click', function() {

  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentTab = tabs[0];
    chrome.cookies.getAll({ url: currentTab.url }, function(cookies) {
      displayCookies(cookies);
    });
  });
});

function displayCookies(cookies) {
  var cookieList = document.getElementById('listAllCookies');
  cookieList.innerHTML = '<h2>Cookies:</h2>';
  if (cookies.length === 0) {
    cookieList.innerHTML += '<p>No cookies found.</p>';
  } else {
    cookies.forEach(function(cookie) {
      cookieList.innerHTML += '<p><strong>' + cookie.name + ':</strong> ' + cookie.value + '</p>';
    });
  }

}