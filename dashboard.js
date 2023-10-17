
function getAllCookies() {
    chrome.cookies.getAll({ url: 'https://https://www.youtube.com/"' }, function(cookies) {
      console.log(cookies);
    });
  }
  
  getAllCookies();
  