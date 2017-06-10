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

        xit('should return an error if no connection has been established', function () {
            const connectionError = {
                msg: 'mongodb connection not found'
            };
            mongoUtil.getDb().should.equal(connectionError);
        });

    });

    describe('loadFixtures', function(done) {

        it.only('should return an error if no fixtures data is found', function () {
            // function getFixtures () {
            //     return undefined;
            // };

            // const fixtures = getFixtures();
            const noFixturesFoundErr = {
                msg: 'No fixtures found'
            };

            function manageError (err) {
                err.should.equal(noFixturesFoundErr);
            }

            mongoUtil.loadFixtures()
                .then(() => done())
                .catch(manageError);
        });

function getFixtures() {
    const path = process.cwd();
    const loadFixturesPath = path + '/test/fixtures/loadFixtures.json';
    const loadFixtures = require(loadFixturesPath);

    return loadFixtures.collections.bets;
}

        it.only('should load fixtures data to test db', function (done) {
            const collection = 'bets';
            const fixtures = getFixtures();
            
            mongoUtil.connect().then(function(db) {
                mongoUtil.loadFixtures(db, done).then(function() {
                    db.collection(collection).find({}).then.toArray().then((bets) => {
                        bets.length.should.equal(fixtures.length);
                    });
                })
                .then(() => done(), done);
            })
            .then(() => done(), done);
        });

    });

});