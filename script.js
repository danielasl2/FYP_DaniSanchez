document.addEventListener('DOMContentLoaded', function () {
    var getCookieButton = document.getElementById('getCookie');
    var cookieInfoDiv = document.getElementById('cookieInfo');
  
    getCookieButton.addEventListener('click', function () {
      getCookieInformation();
    });
  
    function getCookieInformation() {
      var cookieDetails = {
        url: 'https://www.youtube.com/',  
        name: 'youtuveCookie'           
      };
  
      chrome.cookies.get(cookieDetails, function (cookie) {
        if (cookie) {
          cookieInfoDiv.textContent = 'Cookie found:\n' +
            'Name: ' + cookie.name + '\n' +
            'Value: ' + cookie.value + '\n' +
            'Domain: ' + cookie.domain + '\n' +
            'Path: ' + cookie.path + '\n' +
            'Secure: ' + cookie.secure + '\n' +
            'HttpOnly: ' + cookie.httpOnly + '\n' +
            'SameSite: ' + cookie.sameSite + '\n' +
            'ExpirationDate: ' + cookie.expirationDate;
        } else {
          cookieInfoDiv.textContent = 'Cookie not found.';
        }
      });
    }
  });
  