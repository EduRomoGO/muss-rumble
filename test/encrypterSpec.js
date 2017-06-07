'use strict';

const chai = require('chai');
const should = chai.should();
const encrypter = require('../encrypter.js');

describe('encrypter module', function() {
    const toEncryptStr = 'spider';
    const secretKey = 'bread';

    it('should be able to encrypt/decrypt a string and receive the same value', function() {
        const encryptedStr = encrypter.encrypt(toEncryptStr, secretKey);
        const decryptedStr = encrypter.decrypt(encryptedStr, secretKey);

        decryptedStr.should.equal(toEncryptStr);
    });

});