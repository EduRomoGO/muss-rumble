'use strict';

const CryptoJS = require("crypto-js");

module.exports = {
    encrypt: function(strToEncrypt, secretKey) {
        const ciphertext = CryptoJS.AES.encrypt(strToEncrypt, secretKey);
        return ciphertext.toString();
    },

    decrypt: function(strToDecrypt, secretKey) {
        var bytes  = CryptoJS.AES.decrypt(strToDecrypt, secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
};