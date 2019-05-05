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
    let n = camelCase(appName);

    console.log('process.env.NODE_ENV');
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === 'test') {
      n = n + 'Test';
    }

    return n;
    // return camelCase(appName);
}

module.exports = {getDBName};
