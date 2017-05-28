'use strict';

const CryptoJS = require("crypto-js");

module.exports = {
    encrypt: function(password, secretKey) {
        const ciphertext = CryptoJS.AES.encrypt(password, secretKey);
        return ciphertext.toString();
    },

    decrypt: function(password, secretKey) {
        var bytes  = CryptoJS.AES.decrypt(password, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};