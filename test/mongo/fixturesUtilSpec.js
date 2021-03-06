'use strict';

const {getFixtures} = require('../../mongo/fixturesUtil.js');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const sinon = require('sinon');
const sandbox = sinon.sandbox.create();

describe('fixturesUtil', function() {

    describe('getFixtures method', function() {

        it('should retrieve fixtures from fixtures file if no file is specified', function() {
            const fixturesFileData = require('../fixtures/fixtures.json');
            
            Object.keys(getFixtures().collections).should.deep.equal(Object.keys(fixturesFileData.collections));
        });

        it('should retrieve fixtures from file passed as parameter', function() {
            const loadFixtures = 'loadFixtures';
            const fixturesFileData = require(`../fixtures/${loadFixtures}.json`);

            Object.keys(getFixtures(loadFixtures).collections).should.deep.equal(Object.keys(fixturesFileData.collections));
        });

    });

});