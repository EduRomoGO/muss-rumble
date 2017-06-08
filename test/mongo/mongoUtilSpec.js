'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();

console.info(`Tests running on ${process.env.NODE_ENV} env`);

function setEnv(env) {
    process.env.NODE_ENV = env;
}

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

describe('mongoUtil', function() {

    afterEach(resetEnv);

    it.only('connect method connects to test db if running on test env', function (done) {
        setEnv('test');
        mongoUtil.connect().then(function(db) {
            expect(db.s.databaseName).to.equal('mussRumbleTest');
        })
        .then(() => done(), done);
    });

});