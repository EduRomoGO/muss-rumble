'use strict';

const chai = require('chai');
const should = chai.should();
const { getDBName } = require('../../mongo/mongoDbName.js');

function resetEnv() {
  process.env.NODE_ENV = 'test';
}

describe(`mongoDbName getDBName method should return the db name for local environments (test/development) based on:
          - the name of the app set in package.json
          - current env (test/development/production)`,() => {

  afterEach(resetEnv);

  it('in test env, it returns test db name', function () {
    process.env.NODE_ENV = 'test';
    getDBName().should.equal('mussRumbleTest');
  });

  it('in development env, it returns development db name', function () {
    process.env.NODE_ENV = 'development';
    getDBName().should.equal('mussRumble');
  });

  it('in production env, it returns production db name', function () {
    process.env.NODE_ENV = 'production';
    getDBName().should.equal('mussRumbleProduction');
  });
});