'use strict';

var camelCase = require('camel-case');
const minimist = require('minimist');

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

function getDevUrl () {
    const mongoUrlBase = 'mongodb://localhost:27017/';
    const mongoUrlDBName = getDBName();

    return mongoUrlBase + mongoUrlDBName;
}

function getUrl () {
    var argv = minimist(process.argv.slice(2));
	const devMode = argv.env === 'dev';
	const prodMode = process.env.PROD === 'prod';
	let url;

	if (devMode) {
		url = getDevUrl();
	} else if (prodMode){
		url = process.env.MONGODB_URI;
	} else {
        console.log('Not environment specified, please pass arg to inform the env: Ex: node app.js --env=dev');
        process.exit();
    }

	return url;
}

module.exports = {
    get: getUrl
};