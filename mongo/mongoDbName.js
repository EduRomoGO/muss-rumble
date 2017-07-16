'use strict';

const camelCase = require('camel-case');

function getAppName () {
    const path = process.cwd();
    const pjsonPath = path + '/package.json';
    var pjson = require(pjsonPath);

    return pjson.name;
}

function getDBName() {
    const appName = getAppName();
    // const {appName} = require('./app.config.js');
    return camelCase(appName);
}

module.exports = {getDBName};