'use strict';

module.exports = {
    getFixtures: function () {
        const path = process.cwd();
        const loadFixturesPath = path + '/test/fixtures/loadFixtures.json';
        const loadFixtures = require(loadFixturesPath);

        return loadFixtures;
    }
}