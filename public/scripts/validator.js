var validator = (function () {

    function validateString(str, min, max, regex) {
        if (typeof str !== 'string' || str.length < min || str.length > max) {
            return {
                message: 'Invalid: Length must be between ' + min + ' and ' + max
            };
        }
        if (str.test(regex)) {

            return {
                message: 'Invalid: Chars can be ' + chars
            };
        }
    }
    function validateUrl(url) {
        var pattern;

        if (!url || url.length === 0) {
            return;
        }
        // copied from http://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-an-url#answer-5717133
        pattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
        if (!pattern.test(url)) {
            return {
                message: 'Invalid url'
            };
        }
    }

    return {
        validateString: validateString,
        validateUrl: validateUrl
    };
}
    ());