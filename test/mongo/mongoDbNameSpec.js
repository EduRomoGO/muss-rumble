'use strict';

const chai = require('chai');
const should = chai.should();
const { getDBName } = require('../../mongo/mongoDbName.js');

function resetEnv() {
  process.env.NODE_ENV = 'test';
}

describe(`mongoDbName getDBName method`,() => {

  afterEach(resetEnv);

  describe('for local environments should return the db name based on the name of the app (from package.json) and current env', () => {
    it('in test env, it returns test db name', function () {
      process.env.NODE_ENV = 'test';
      getDBName().should.equal('mussRumbleTest');
    });

    it('in development env, it returns development db name', function () {
      process.env.NODE_ENV = 'development';
      getDBName().should.equal('mussRumble');
    });
  });

  describe('for production environment', () => {
    it('should return the test db name present in env var DB_NAME', function () {
      process.env.NODE_ENV = 'production';
      process.env.DB_NAME = 'mussRumbleProductionName';

      getDBName().should.equal('mussRumbleProductionName');
    });
  });
});
