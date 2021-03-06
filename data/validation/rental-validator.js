/* globals module */
'use strict';

const MESSAGE_LENGTH = 'Съобщението трябва да бъде между 2 и 2000 символа',
    MESSAGE_MIN_LENGTH = 2,
    MESSAGE_MAX_LENGTH = 2000;

module.exports = function (validator) {
    return {
        validateMessage(message) {
            return new Promise((resolve, reject) => {
                let escapedMessage = validator.escapeProhibitedChars(message);

                if (!validator.validateLength(escapedMessage, MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH)) {
                    return reject(MESSAGE_LENGTH);
                }

                resolve(message);
            });
        }
    };
};