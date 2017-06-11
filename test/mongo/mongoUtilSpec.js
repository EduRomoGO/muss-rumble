'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const connectionOptions = {silent: true};


function setEnv(env) {
    process.env.NODE_ENV = env;
}

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

function closeConnection() {
    return mongoUtil.closeConnection();
}

function connectDb(done) {
    mongoUtil.connect(connectionOptions).then(() => done()).catch(done);
}

function getCollectionList (db) {
    return db.listCollections().toArray();
}


describe('mongoUtil', function() {

    describe('connect method', function() {

        afterEach(function () {
            resetEnv();
            closeConnection();
            sandbox.restore();
        });

        it('connects to test db if running on test env', function (done) {
            setEnv('test');

            mongoUtil.connect(connectionOptions).then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumbleTest');
            })
            .then(() => done(), done);
        });

        it('connects to development db if running on development env', function (done) {
            setEnv('development');

            mongoUtil.connect(connectionOptions).then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumble');
            })
            .then(() => done(), done);
        });

        it('connects to production db if running on production env', function (done) {
            setEnv('production');

            mongoUtil.connect(connectionOptions).then(function(db) {
                expect(db.s.databaseName).to.equal('mussRumbleProduction');
            })
            .then(() => done(), done);
        });

        it('logs a success message after connection', function (done) {
            const consoleLogSpy = sandbox.stub(console, "log");

            mongoUtil.connect().then(function(db) {
                expect( consoleLogSpy.calledOnce ).to.be.true;
            })
            .then(() => done(), done)
            .catch(done);
        });

        it('doesnt log a success message after connection if silent option is passed', function (done) {
            const consoleLogSpy = sandbox.spy(console, "log");

            mongoUtil.connect(connectionOptions).then(function(db) {
                expect( consoleLogSpy.calledOnce ).to.be.false;
            })
            .then(() => done(), done)
            .catch(done);
        });

    });

    describe('getDb method', function () {
        
        afterEach(function () {
            closeConnection();
            sandbox.restore();
        });

        it('should return the db if the app has established a connection', function (done) {
            mongoUtil.connect(connectionOptions).then(function(db) {
                mongoUtil.getDb().s.databaseName.should.equal('mussRumbleTest');
            })
            .then(() => done(), done);
        });

        it('should return an error if no connection has been established', function () {
            const consoleErrorSpy = sandbox.spy(console, 'error');

            mongoUtil.getDb();
            expect(consoleErrorSpy.calledOnce).to.be.true;
            expect( consoleErrorSpy.calledWith('Error: No DB connection is present') ).to.be.true;
        });

        it('logs an error message if no connection is available', function () {
            const consoleErrorSpy = sandbox.spy(console, 'error');

            mongoUtil.getDb();
            expect(consoleErrorSpy.calledOnce).to.be.true;
        });

    });

    describe('loadFixtures', function(done) {

        before(function (done) {
            connectDb(done);
        });
    
        it('should return an error if no fixtures data is found', function (done) {
            // function getFixtures () {
            //     return undefined;
            // };

            // const fixtures = getFixtures();
            const noFixturesFoundErr = {
                msg: 'No fixtures found'
            };

            // console.info('db.listCollections');
            // mongoUtil.getDb().listCollections().toArray().then((items) => console.info(items));

            function manageError (err) {
                err.should.equal(noFixturesFoundErr);
            }

            mongoUtil.loadFixtures(mongoUtil.getDb())
                .then(() => done())
                .catch(manageError);
        });

        function getFixtures() {
            const path = process.cwd();
            const loadFixturesPath = path + '/test/fixtures/loadFixtures.json';
            const loadFixtures = require(loadFixturesPath);

            return loadFixtures.collections.bets;
        }

        it('should load fixtures data to test db', function (done) {
            const collection = 'bets';
            const fixtures = getFixtures();
            const db = mongoUtil.getDb();
            
            mongoUtil.loadFixtures(db, done).then(function() {
                db.collection(collection).find({}).toArray().then((bets) => {
                    bets.length.should.equal(fixtures.length);
                });
            })
            .then(() => done(), done);
        });

    });

    describe('dropDb method', function(done) {

        before(function (done) {
            connectDb(done);
        });

        it('should remove all collections from an empty db', function(done) {
            const db = mongoUtil.getDb();

            mongoUtil.dropDb(db).then(function () {
                getCollectionList(db).then((collections) => {
                    collections.length.should.equal(0);
                });
            })
            .then(() => done())
            .catch(done);
        });

        it('should remove all collections from a populated db', function(done) {
            const db = mongoUtil.getDb();

            function dropDb() {
                return mongoUtil.dropDb(db);
            }

            function getCollectionListP() {
                return getCollectionList(db);
            }

            function assert(collections) {
                return collections.length.should.equal(0);
            }

            mongoUtil.loadFixtures(db)
            .then(dropDb)
            .then(getCollectionListP)
            .then(assert)
            .then(() => done())
            .catch(done);
        });

    });

    describe('closeConnection method', function(done) {

        before(function (done) {
            connectDb(done);
        });

        it('should close current database connection', function (done) {
            function assert() {
                const db = mongoUtil.getDb();
                return expect(db).to.eql(undefined);
            }

            closeConnection()
            .then(assert)
            .then(() => done())
            .catch(done);
        });

    });

});