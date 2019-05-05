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

  return `${appNameCamelCase}${process.env.NODE_ENV === 'test' ? 'Test' : ''}`;
}

module.exports = { getDBName };
