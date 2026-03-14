function _sendEvent(name, data, response) {
    chrome.runtime.sendMessage({eventName: name, eventData: data}, response);
}

var initCallbacks = [];

function _onInit(callback) {
    initCallbacks.push(callback);
}

function init() {
    console.log('init');
    
    var manifest = chrome.runtime.getManifest();
    $('#version').html(manifest.version);

    initCallbacks.forEach(function (c) {
        c();
    });
};

chrome.runtime.onMessage.addListener(function (request) {
    if (request.eventName === 'popup:emailCount') {
        updateNumberOfEmailsFound(request.count);
    } else if (request.eventName === 'popup:progress') {
        updateTotalNumberOfQueries(request.totalQueries);
        updateCurrentQueryNumber(request.currentQuery);
        updateCurrentQueryString(request.queryString);
    } else if (request.eventName === 'popup:complete') {
        hideCurrentQueryString();
        showCompleteStatus();
        updateButtonsFromState(request.state);
    } else if (request.eventName === 'popup:started') {
        showCurrentQueryString();
        hideCompleteStatus();
        updateButtonsFromState(request.state);
    } else if (request.eventName === 'popup:buttons') {
        updateButtonsFromState(request.state);
    }
});

$(init);