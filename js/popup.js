function displayResult(url) {
  if (url.indexOf('imdb.com') > -1 ) {
    var urlArray = url.split('/');

    var imdbID = urlArray[4];

    var imdbIDNum = imdbID.slice(2, imdbID.length);


    var bechdelApiUrl = "http://bechdeltest.com/api/v1/getMovieByImdbId?imdbid=" + imdbIDNum;

    $.getJSON(bechdelApiUrl, function(data) {
      document.getElementById('result').textContent = JSON.stringify(data);
    });

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

    // DELETE LATER
    // document.getElementById('result').textContent = url;
    callback(url);
  });
}
// function renderBechdelRating(statusText) {
//   document.getElementById('status').textContent = statusText;
// }

document.addEventListener('DOMContentLoaded', function() {
  var url = getCurrentTabUrl(displayResult);
});