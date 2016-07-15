function setRatingText(rating) {
  var eval; 

  if (rating == 0) {
    eval = "This movie does not have at least 2 named women :(";

  } else if (rating == 1) {
    eval = "There are 2 named women in this movie, but they don't talk to each other. Eek.";

  } else if (rating == 2) {
    eval = "The are 2 named women in this movie who talk to each other, but they only about men. Hmph.";

  } else if (rating == 3) {
    eval = "It passes! There are at least 2 named women who talk to each other about something besides a man.";
  }

  return eval;
}

function setDisplayText(response) {
  var displayText;

  if (response.status == '404') {
    var noRatingElement = document.getElementById('no-rating');
    noRatingElement.style.display = 'block';
  
  } else if (response.status == '403') {
    displayText = "A rating for this movie has been submitted, but it hasn't been approved yet."
  
  } else if (response.status == '505') {
    displayText = "Hmmm something went wrong. Please contact the creators of this extension through the Chrome Store."
  
  } else {
    displayText = setRatingText(response.rating);
  }

  return displayText;
}

function hideLoadingElement() {
  var loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'none';
}

function showLoadingElement() {
  var loadingElement = document.getElementById('loading');
  loadingElement.style.display = 'block';
}

function setTitleElement(title) {
  var titleElement = document.getElementById('title');
  titleElement.textContent = title;
  titleElement.style.display = 'block';
}

function setRatingElement(displayText) {
  var ratingElement = document.getElementById('rating');
  ratingElement.textContent = displayText;
  ratingElement.style.display = 'block';
}

function displayResponse(response) {
  var displayText = setDisplayText(response);

  hideLoadingElement();

  setTitleElement(response.title);

  setRatingElement(displayText);
}

function getBechdelData(url) {
  if (url.match('http://www.imdb.com/*') && url !== "http://www.imdb.com/") {
    showLoadingElement();

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
    hideLoadingElement();

    var notImdbElement = document.getElementById('not-imdb');
    notImdbElement.style.display = 'block';
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