var _emailTypePresets = {
    "isp-all": "@gmail.com\n@yahoo.com\n@outlook.com\n@hotmail.com\n@aol.com\n@icloud.com\n@protonmail.com\n@mail.com\n@gmx.com",
    "isp-gmail": "@gmail.com",
    "isp-yahoo": "@yahoo.com",
    "isp-outlook": "@outlook.com",
    "isp-hotmail": "@hotmail.com",
    "isp-aol": "@aol.com",
    "isp-icloud": "@icloud.com",
    "isp-protonmail": "@protonmail.com\n@proton.me",
    "biz-all": "@company.com",
    "biz-edu": "@edu",
    "biz-gov": "@gov"
};

_onInit(function () {

    $('#email-type-select').on('change', function () {
        var val = $(this).val();
        if (val === 'custom') {
            $('#pattern-input').val('').attr('disabled', false);
        } else if (_emailTypePresets[val]) {
            $('#pattern-input').val(_emailTypePresets[val]).attr('disabled', false);
            storePatterns(_emailTypePresets[val]);
        }
    });

    // On load, sync the dropdown with any stored pattern value
    chrome.storage.local.get('patterns', function (items) {
        if (!items.patterns) return;
        var stored = items.patterns.trim();
        var matched = false;
        Object.keys(_emailTypePresets).forEach(function (key) {
            if (_emailTypePresets[key].trim() === stored) {
                $('#email-type-select').val(key);
                matched = true;
            }
        });
        if (!matched) {
            $('#email-type-select').val('custom');
        }
    });

});
