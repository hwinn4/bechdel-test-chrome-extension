var ratingText = {
  '0' : 'This movie does not have at least 2 women with names :(',
  '1' : 'There are 2 women with names in this movie, but they don\'t talk to each other. Eek.',
  '2' : 'There are 2 women with names in this movie who talk to each other, but they only talk about men. Hmph.',
  '3' : 'It passes! There are at least 2 women with names who talk to each other about something besides a man.'
};

var errorMessages = {
  '404' : 'no-rating',
  '403' : 'rating-submitted',
  '505' : 'wrong-api-version'
};

var colors = {
  '0' : 'lightgray', 
  '1' : '#e11c0e', 
  '2' : '#fcee75',
  '3' : '#92d76f'
};

function hideElement(id) {
  var el = document.getElementById(id);
  el.style.display = 'none';
}

function showElement(elementId) {
  var el = document.getElementById(elementId);
  el.style.display = 'block'; 
}

function setElementText(elementId, text) {
  var el = document.getElementById(elementId);
  el.textContent = text;
  el.style.display = 'block';
}

function setRatingsBar(rating) {
  var bars = document.getElementsByClassName('scale-bar');

  for(var i = 0; i < rating; i++) {
    bars[i].style.background = colors[rating];
  }

  document.getElementById('scale').style.display = 'flex';
}

function displayResponse(response) {
  hideElement('loading');

  if (response.status) {
    hideElement('rating');

    showElement(errorMessages[response.status]);

  } else {
    setRatingsBar(response.rating);

    setElementText('title', response.title);
    setElementText('rating', ratingText[(response.rating)]);
  }
}

function apiEndpointUrl(url) {
  var fullImdbID = url.split('/')[4];
  var imdbIDNum = fullImdbID.slice(2, fullImdbID.length);
  var endpoint = "http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=" + imdbIDNum;

  return endpoint;
}

function getBechdelData(url) {
  if (url.match('http://www.imdb.com/*') && url !== "http://www.imdb.com/") {
    showElement('loading');

    var endpoint = apiEndpointUrl(url)

    var xhr = new XMLHttpRequest();
    xhr.open("GET", endpoint);
    xhr.responseType = 'json';
  
    xhr.send();

    xhr.onload = function() {
      var response = xhr.response;
      displayResponse(response);
    };

    xhr.onerror = function() {
      hideElement('loading');
      showElement('ajax-error');
    };

  } else {
    hideElement('loading');

    hideElement('rating');

    showElement('not-imdb');
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

document.addEventListener('DOMContentLoaded', function() {
  var url = getCurrentTabUrl(getBechdelData);
});