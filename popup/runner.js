
var log = new Log('popupRunner');

function updateNumberOfEmailsFound(n) {
    $('#collected-emails').text(n);   
}

function updateCurrentQueryNumber(n) {
    $('#current-query').text(n);
}

function updateCurrentQueryString(s) {
    $('#current-query-string').text(s);
}

function showCurrentQueryString() {
    $('#runner-status').show();
}

function hideCurrentQueryString() {
    $('#runner-status').hide();
}

function updateTotalNumberOfQueries(n) {
    $('#total-queries').text(n);
}

function showCompleteStatus() {
    $('#progress-complete-indicator').show();
    $('#progress-running, #progress-stopped-indicator').hide();
}

function hideCompleteStatus() {
    $('#progress-complete-indicator, #progress-stopped-indicator').hide();
    $('#progress-running').show();
}

function showStoppedStatus() {
    $('#progress-stopped-indicator').show();
    $('#progress-complete-indicator, #progress-running').hide();
}

function hideStoppedStatus() {
    $('#progress-stopped-indicator, #progress-complete-indicator').hide();
    $('#progress-running').show();
}

function updateButtonsFromState(state) {
    if(state.running) {
        $('#toggle').text('STOP').data('status', 'stop');
        $('#download').attr('disabled', true);
    } else {
        if(state.complete) {
            $('#toggle').text('START').data('status', 'start');
            $('#download').attr('disabled', false);
        } else {
            $('#toggle').text('START').data('status', 'start');
            if (state.emailCount > 0) {
                $('#download').attr('disabled', false);
            } else {
                $('#download').attr('disabled', true);
            }
        }
    }
}

_onInit(function () {
    
    _sendEvent('state:get', {}, function (state) {
        updateNumberOfEmailsFound(state.emailCount);

        var currentQuery = state.totalQueries > 0 ? state.currentQuery + 1 : 0;

        updateCurrentQueryNumber(currentQuery);
        updateTotalNumberOfQueries(state.totalQueries);
        
        if(state.running) {
            showCurrentQueryString();
            updateCurrentQueryString(state.queryString);
        } else {
            hideCurrentQueryString();
        }
        
        state.complete ? showCompleteStatus() : hideCompleteStatus();
        
        updateButtonsFromState(state);
    });
    
    $('#delayInput').on('change keyup input', function () {
        var delay = (parseInt($(this).val(), 10)*1000) ? (parseInt($(this).val(), 10)*1000) : 0;
        _sendEvent('state:setDelay', {delay: delay});
    });
    
    $('#removeDuplicates').change(function () {
        _sendEvent('state:setRemoveDuplicates', {value: this.checked});
    });
    
    $('#toggle').click(function () {
        log.i('start:', $(this).data('status'));
        if($(this).data('status') === 'stop') {
            showStoppedStatus();
            _sendEvent('state:stop', {});
            $('#download').attr('disabled', false);
        }  else {
            hideStoppedStatus();
            _sendEvent('state:start', {queries: getQueries()});
        }
    });
    
    $('#download').click(function () {
        _sendEvent('state:download', {});
    });
    
});