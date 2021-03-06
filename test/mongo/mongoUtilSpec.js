'use strict';

const mUtil = require('../../mongo/mongoUtil.js');
const {getFixtures} = require('../../mongo/fixturesUtil.js');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();
const async = require('async');
const connectionOptions = {silent: true};

const dbName = 'muss-rumble-test';
const mongoUtil = mUtil({dbName, dbUrl: 'mongodb://localhost:27017/muss-rumble-test'});


function setEnv(env) {
    process.env.NODE_ENV = env;
}

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

function closeConnection() {
    return mongoUtil.closeConnection(connectionOptions);
}

function connectDb(done) {
    mongoUtil.connect(connectionOptions).then(() => done()).catch(done);
}

function getCollectionList (db) {
    return db.listCollections().toArray();
}

function dropDb(db) {
    return mongoUtil.dropDb(db);
}


describe.only('mongoUtil function', () => {
  it('should return an error if no config obj has been pased', () => {
    const wrap = () => mUtil();
    expect(wrap).to.throw('mongoUtil config must not be undefined');
  });

  it('should return an error if no dbName param has been pased', () => {
    const wrap = () => mUtil({ dbUrl: 'fake-url' });
    expect(wrap).to.throw('mongoUtil dbName config prop is required');
  });

  it('should return an error if no dbUrl param has been pased', () => {
    const wrap = () => mUtil({ dbName: 'fake-name' });
    expect(wrap).to.throw('mongoUtil dbUrl config prop is required');
  });

  it('should not return an error if dbName and dbUrl params has been pased', () => {
    const wrap = () => mUtil({ dbName: 'fake-name', dbUrl: 'fake-url'});
    expect(wrap).to.not.throw();
  });
});

describe('mongoUtil methods', function() {
    describe('connect method', function() {

        afterEach(function () {
            resetEnv();
            closeConnection();
            sandbox.restore();
        });

        it('connects to db name passed', function (done) {
            setEnv('test');

            mongoUtil.connect(connectionOptions).then(function(db) {
                expect(db.s.databaseName).to.equal(dbName);
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
                mongoUtil.getDb().s.databaseName.should.equal(dbName);
            })
            .then(() => done(), done);
        });

        it('should return an error if no connection has been established', function () {
            const consoleErrorSpy = sandbox.stub(console, 'error');

            mongoUtil.getDb();
            expect(consoleErrorSpy.calledOnce).to.be.true;
            expect( consoleErrorSpy.calledWith('Error: No DB connection is present') ).to.be.true;
        });

        it('should log an error message if no connection is available', function () {
            const consoleErrorSpy = sandbox.stub(console, 'error');

            mongoUtil.getDb();
            expect(consoleErrorSpy.calledOnce).to.be.true;
        });

        it('should not log an error message if no connection is available and silent option passed', function () {
            const consoleErrorSpy = sandbox.spy(console, 'error');

            mongoUtil.getDb(connectionOptions);
            expect(consoleErrorSpy.called).to.be.false;
        });
    });

    describe('loadFixtures', function(done) {

        before(function (done) {
            connectDb(done);
        });

        beforeEach(function (done) {
            dropDb(mongoUtil.getDb()).then(() => done());
        });

        // Pending cause its difficoult to test it and its not worth it
        xit('should return an error if no fixtures data is found', function (done) {

            function manageError (err) {
                err.should.equal(noFixturesFoundErr);
            }

            mongoUtil.loadFixtures(mongoUtil.getDb())
                .then(() => done())
                .catch(manageError);
        });

        it('should load fixtures data to test db', function (done) {
            const fixtures = getFixtures();
            const db = mongoUtil.getDb();

            function getDbCollections () {
                return getCollectionList(db);
            }

            function makeAsserts(collections) {
                return new Promise((resolve, reject) => {
                    async.each(collections, function(collection, cb) {
                        db.collection(collection.name).find({}).toArray().then((items) => {
                            cb();
                            return items.length.should.equal(fixtures.collections[collection.name].length);
                        })
                        .catch(err => reject(err));
                    }, function (err) {
                        if (err) { reject(err); }
                        resolve();
                    });
                });
            }

            mongoUtil.loadFixtures(db)
            .then(getDbCollections)
            .then(makeAsserts)
            .then(() => done())
            .catch(done);
        });

        it('should allow to pass fixtures parameter to be used to load the data', (done) => {
            const fixtures = {
                "collections": {
                  "dolls": [
                    {
                      "user": "Peter Parker",
                      "text": "I like ice cream."
                    },
                  ],
                  "cars": [
                    {
                      "user": "Peter Parker",
                      "text": "I like ice cream."
                    },
                  ],
                  "houses": [{
                    "_id": "generatedId",
                    "size": "tall"
                  }],
                  "counters": [
                    { "_id" : "horses", "seq" : 1 },
                    { "_id" : "turtles", "seq" : 7 }
                  ]
                }
            };

            function makeAsserts(collections) {
                return new Promise((resolve, reject) => {
                    async.each(collections, function(collection, cb) {
                        mongoUtil.getDb().collection(collection.name).find({}).toArray()
                            .then((items) => {
                                cb();
                                return items.length.should.equal(fixtures.collections[collection.name].length);
                            })
                            .catch(err => reject(err));
                    }, function (err) {
                        if (err) { reject(err); }
                        resolve();
                    });
                });
            }

            mongoUtil.dropDb(mongoUtil.getDb())
                .then(() => mongoUtil.loadFixtures(mongoUtil.getDb(), fixtures))
                .then(() =>  getCollectionList(mongoUtil.getDb()))
                .then(makeAsserts)
                .then(() => done())
                .catch(err => done(err));
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

            function executeDrop() {
                return dropDb(db);
            }

            function getCollectionListP() {
                return getCollectionList(db);
            }

            function assert(collections) {
                return collections.length.should.equal(0);
            }

            mongoUtil.loadFixtures(db)
            .then(executeDrop)
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
                const db = mongoUtil.getDb(connectionOptions);
                return expect(db).to.eql(undefined);
            }

            closeConnection()
            .then(assert)
            .then(() => done())
            .catch(done);
        });

    });

    describe('updateAndGetNextSequence method', function () {

        before(function (done) {
            connectDb(done);
        });

        it('should update next sequence for a given collection in the db', function (done) {
            const collection = 'horses';
            const db = mongoUtil.getDb();
            const getCollectionCounter = () => db.collection('counters').find({_id: collection}).toArray();

            mongoUtil.loadFixtures(db)
                .then(getCollectionCounter)
                .then((counter) => counter[0].seq.should.equal(1))
                .then(() =>  mongoUtil.updateAndGetNextSequence(db, collection))
                .then(getCollectionCounter)
                .then((counter) => counter[0].seq.should.equal(2))
                .then(() => done())
                .catch(done);
        });

    });

    describe('changeGeneratedIdsToSequentialIds method', function () {

        before(function (done) {
            connectDb(done);
        });

        beforeEach(function (done) {
            mongoUtil.dropDb(mongoUtil.getDb()).then(() => done());
        });

        it('should change generated ids from a collection to sequential ids', function (done) {
            const db = mongoUtil.getDb();
            const collection = 'houses';

            function changeGeneratedIdsToSequentialIds() {
                return mongoUtil.changeGeneratedIdsToSequentialIds(db, collection);
            }

            function getCollectionItems () {
                return db.collection(collection).find().toArray();
            }

            function assert(collectionItems) {
               return collectionItems[0]._id.should.equal(1);
            }

            mongoUtil.loadFixtures(db)
            .then(changeGeneratedIdsToSequentialIds)
            .then(getCollectionItems)
            .then(assert)
            .then(() => done())
            .catch(done);
        });

    });

    describe('findLastElementAdded', () => {

        before(function (done) {
            connectDb(done);
        });

        beforeEach(function (done) {
            mongoUtil.dropDb(mongoUtil.getDb()).then(() => done());
        });

        it('should return the last element added to a given collection', function (done) {
            const db = mongoUtil.getDb();
            const collection = 'cars';
            const assert = lastElementAddedList => {
                lastElementAddedList[0].user.should.equal("Peter Parker");
                lastElementAddedList[0].text.should.equal("I like ice cream.");
            }

            mongoUtil.loadFixtures(db)
                .then(() => mongoUtil.findLastElementAdded(db, collection))
                .then(assert)
                .then(() => done())
                .catch(done);
        });
    });

});
