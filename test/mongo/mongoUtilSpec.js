'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();

console.info(`Tests running on ${process.env.NODE_ENV} env`);

describe('mongoUtil', function() {

    it.only('aaaa', function (done) {
        return mongoUtil.connect().then(function(db) {
            expect(db).to.equal('sathoeu');
        })
        .then(() => done(), done);
    });

});