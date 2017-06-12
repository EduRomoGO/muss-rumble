'use strict';

module.exports = {
    getFixtures: function () {
        const path = process.cwd();
        const fixturesPath = path + '/test/fixtures/fixtures.json';

        return require(fixturesPath);
    }
}