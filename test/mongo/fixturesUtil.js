'use strict';

const {getFixtures} = require('../../mongo/fixturesUtil.js');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

describe('fixturesUtil', function() {

    describe('getFixtures method', function() {

        it('should retrieve fixtures from fixtures file if no file is specified', function() {
            const fixturesFileData = require('../fixtures/fixtures.json');
            
            Object.keys(getFixtures()).should.eql(Object.keys(fixturesFileData));
        });

    });

});