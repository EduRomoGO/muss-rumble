'use strict';

const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const mongoUrl = require('../../mongo/mongoUrl.js');

function resetEnv() {
    process.env.NODE_ENV = 'test';
}

describe('mongoUrl module get method should return the connection url based on the name of the app set in package.json', function() {

    afterEach(resetEnv);

    describe('and on current env (test/development/production)', function() {

        it('in test env, it returns test url', function() {
            process.env.NODE_ENV = 'test';
            mongoUrl.get().should.equal('mongodb://localhost:27017/mussRumbleTest');
        });

        it('in development env, it returns development url', function() {
            process.env.NODE_ENV = 'development';
            mongoUrl.get().should.equal('mongodb://localhost:27017/mussRumble');
        });

        it('in production env, it returns production url', function() {
            process.env.NODE_ENV = 'production';
            mongoUrl.get().should.to.equal(process.env.MONGODB_URI);
        });

    });

});
