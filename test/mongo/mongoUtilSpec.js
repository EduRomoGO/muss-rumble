'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();

console.info(`Tests running on ${process.env.NODE_ENV} env`);
console.info(`Mongodb production fake uri stated in npm test script: ${process.env.MONGODB_URI}`);

function setEnv(env) {
    process.env.NODE_ENV = env;
}

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

describe('mongoUtil', function() {

    afterEach(resetEnv);

    it('connect method connects to test db if running on test env', function (done) {
        setEnv('test');

        mongoUtil.connect().then(function(db) {
            expect(db.s.databaseName).to.equal('mussRumbleTest');
        })
        .then(() => done(), done);
    });

    it('connect method connects to development db if running on development env', function (done) {
        setEnv('development');

        mongoUtil.connect().then(function(db) {
            expect(db.s.databaseName).to.equal('mussRumble');
        })
        .then(() => done(), done);
    });

    it('connect method connects to production db if running on production env', function (done) {
        setEnv('production');

        mongoUtil.connect().then(function(db) {
            expect(db.s.databaseName).to.equal('mussRumbleProduction');
        })
        .then(() => done(), done);
    });

});