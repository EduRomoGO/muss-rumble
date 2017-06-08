'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();

function setEnv(env) {
    process.env.NODE_ENV = env;
}

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

function closeConnection() {
    mongoUtil.getDb().close();
}

describe('mongoUtil', function() {

    describe('connect method', function() {

        afterEach(function () {
            resetEnv();
            closeConnection();
        });

        it('connects to test db if running on test env', function (done) {
            setEnv('test');

            mongoUtil.connect().then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumbleTest');
            })
            .then(() => done(), done);
        });

        it('connects to development db if running on development env', function (done) {
            setEnv('development');

            mongoUtil.connect().then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumble');
            })
            .then(() => done(), done);
        });

        it('connects to production db if running on production env', function (done) {
            setEnv('production');

            mongoUtil.connect().then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumbleProduction');
            })
            .then(() => done(), done);
        });

    });

    describe('getDb method', function () {
        
        afterEach(function () {
            closeConnection();
        });

        it('should return the db if the app has established a connection', function (done) {
            
            mongoUtil.connect().then(function(db) {
                mongoUtil.getDb().s.databaseName.should.equal('mussRumbleTest');
            })
            .then(() => done(), done);
        });

    });

});