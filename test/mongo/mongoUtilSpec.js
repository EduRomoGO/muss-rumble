'use strict';

const mongoUtil = require('../../mongo/mongoUtil.js');
const chai = require('chai');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();
var assert = require('assert');

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

describe('mongoUtil', function() {
    // this.timeout(3000);

    afterEach(resetEnv);

    // describe('connect', function() {

        it('connect method should connect to ', function(done) {
            // process.env.NODE_ENV = 'test';
            // mongoUtil.connect().then((db) => {console.log(db)});
            // mongoUtil.connect().should.eventually.deep.equal("foo");
            // return mongoUtil.connect().should.eventually.deep.equal("foo");
            // return expect(mongoUtil.connect()).to.eventually.have.property("foo");
            expect(mongoUtil.connect()).to.eventually.have.property("fooauaoust").notify(done);
            // return mongoUtil.connect().should.eventually.equal('aeu');
        });

// return new Promise(function (resolve) {
//     assert.ok(true);
//     resolve();
//   })
//     .then(done);

        it.only('aaaa', function (done) {
            // return mongoUtil.connect().then(done);
            // return mongoUtil.connect().then(() => done(), done);
            mongoUtil.connect().then(function(db) {
                expect(db).to.equal('sathoeu');
                // assert.equal(db.s.databaseName, 'mussRumbleTesat');
                // done();
            })
            .then(() => done(), done);
            // return expect(mongoUtil.connect()).to.eventually.have.property('satnehonathue');
        });

        it('in development env, it returns development url', function() {
            process.env.NODE_ENV = 'development';
            mongoUrl.get().should.equal('mongodb://localhost:27017/mussRumble');
        });

        it('in production env, it returns production url', function() {
            process.env.NODE_ENV = 'production';
            const prodUrl = 'fakeProductionUrl';
            process.env.MONGODB_URI = prodUrl;

            mongoUrl.get().should.to.equal(prodUrl);
        });

    // });

});