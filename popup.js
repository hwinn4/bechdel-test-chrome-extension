function displayResponse(response) {
  var eval; 

  if (response.rating == 0) {
    eval = "This movie does not have at least 2 named women :(";

  } else if (response.rating == 1) {
    eval = "The named women in the movie don't talk to each other. Eek.";

  } else if (response.rating == 2) {
    eval = "The named women talk to each other, but only about a man. Hmph.";

  } else if (response.rating == 3) {
    eval = "It passes! The named women talk to each other about something besides a man.";
  }

  var loadingElement = document.getElementById('loading');
  var titleElement = document.getElementById('title');
  var ratingElement = document.getElementById('rating');

  loadingElement.textContent = '';
  loadingElement.style.display = 'none';

  titleElement.textContent = response.title;
  titleElement.style.display = 'block';

  ratingElement.textContent = eval;
  ratingElement.style.display = 'block';

}

function getBechdelData(url) {
  if (url.indexOf('imdb.com') > -1 ) {
    var urlArray = url.split('/');
    var imdbID = urlArray[4];
    var imdbIDNum = imdbID.slice(2, imdbID.length);
    var endpoint = "http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=" + imdbIDNum;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint);
    xhr.responseType = 'json';
  
    xhr.onload = function() {
      console.log('xhr onload');
      var response = xhr.response;

      displayResponse(response);
    };

    xhr.onerror = function() {
      document.getElementById('result').textContent = "Hmmm...try a different movie! You can add your own ratings to the Bechdel Test API <a href='http://bechdeltest.com/add/'>here</a>";
    };

    xhr.send();

  } else {
    // FIGURE OUT LATER
    // var msg = "<p>Head over to <a href='https://www.imdb.com' target='_blank'>IMDB</a> to use this extension.</p>";
    // $('#result').html(msg);
    // document.getElementById('result').innerHtml = msg;
  }
}

function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });
}
// function renderBechdelRating(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

document.addEventListener('DOMContentLoaded', function() {
  var url = getCurrentTabUrl(getBechdelData);
});