'use strict';

const camelCase = require('camel-case');

const getPackageJsonData = () => {
  const pjsonPath = process.cwd() + '/package.json';

  return require(pjsonPath);
}

function getAppName() {
  return getPackageJsonData().name;
}

function getDBName() {
  let appNameCamelCase = camelCase(getAppName());

  const dbNameSuffix = {
    test: 'Test',
    development: '',
    production: 'Production',
  };

  return `${appNameCamelCase}${dbNameSuffix[process.env.NODE_ENV]}`;
}

module.exports = { getDBName };
