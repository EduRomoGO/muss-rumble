'use strict';

module.exports = {
    getFixtures: function (file) {
        const path = process.cwd();
        const fixturesPath = path + `/test/fixtures/${file ? file : 'fixtures'}.json`;

        return require(fixturesPath);
    }
}