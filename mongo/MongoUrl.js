'use strict';

const {getDBName} = require('./mongoDbName.js');

function getLocalDBUrl () {
    const mongoUrlBase = 'mongodb://localhost:27017/';
    const mongoUrlDBName = getDBName();

    return mongoUrlBase + mongoUrlDBName;
}

const getEnvironmentUrls = () => ({
    test: getLocalDBUrl(),
    development: getLocalDBUrl(),
    production: process.env.MONGODB_URI
});

function getUrl () {
  const environmentsUrls = getEnvironmentUrls();

    if (Object.keys(environmentsUrls).includes(process.env.NODE_ENV)) {
        return environmentsUrls[process.env.NODE_ENV];
    } else {
        console.error(`Not environment specified, NODE_ENV should be one of ${Object.keys(environmentsUrls)}`);
        process.exit();
    }
}

module.exports = {
    get: getUrl
};
