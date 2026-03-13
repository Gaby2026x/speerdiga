serpdigger.api = {};

serpdigger.api.registration = {
    PAID: "paid",
    TRIAL: "trial"
};

serpdigger.api.registration.status = function (username, password, callback) {
    
    var data = new URLSearchParams();
    data.append(serpdigger.config.api.registration.status.keys.username, username);
    data.append(serpdigger.config.api.registration.status.keys.password, password);
    
    fetch(serpdigger.config.api.registration.status.url, {
        method: serpdigger.config.api.registration.status.method,
        headers: {
            "Authorization": "Basic " + btoa(serpdigger.config.api.httpuser + ":" + serpdigger.config.api.httppass),
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data
    })
    .then(function(response) { return response.text(); })
    .then(function(text) {
        callback((text == "VALID|PAID") ? serpdigger.api.registration.PAID : serpdigger.api.registration.TRIAL);
    })
    .catch(function() {
        callback(serpdigger.api.registration.TRIAL);
    });
    
};

serpdigger.api.footprints = {};

function _parseFootprints(str) {
    return str.split(/[\n]+/g).slice(0, -1).map(function (s) {
        var s = s.split(/\*/g);
        return {
            name: s[0],
            value: s[1]
        };
    });
}

serpdigger.api.footprints.get = function (callback) {
    fetch(serpdigger.config.api.footprints.url, {
        method: serpdigger.config.api.footprints.method,
        cache: 'no-cache'
    })
    .then(function(response) { return response.text(); })
    .then(function(data) {
        callback(_parseFootprints(data));
    })
    .catch(function() {
        callback([]);
    });
};