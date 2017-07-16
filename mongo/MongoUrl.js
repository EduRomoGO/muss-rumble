'use strict';

const {getDBName} = require('./mongoDbName.js');

function getDevUrl () {
    const mongoUrlBase = 'mongodb://localhost:27017/';
    const mongoUrlDBName = getDBName();

    return mongoUrlBase + mongoUrlDBName;
}

const environmentsUrls = {
    test: getDevUrl() + 'Test',
    development: getDevUrl(),
    production: process.env.MONGODB_URI
};

function getUrl () {
    if (Object.keys(environmentsUrls).includes(process.env.NODE_ENV)) {
        return environmentsUrls[process.env.NODE_ENV];
    } else {
        console.error(`Not environment specified, NODE_ENV is not one of ${Object.keys(environmentsUrls)}`);
        process.exit();
    }
}

module.exports = {
    get: getUrl
};