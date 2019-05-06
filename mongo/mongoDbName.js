'use strict';

const camelCase = require('camel-case');

const getPackageJsonData = () => {
  const pjsonPath = process.cwd() + '/package.json';

  return require(pjsonPath);
}

function getAppName() {
  return getPackageJsonData().name;
}

const getDbLocalBaseName = () => camelCase(getAppName());

function getDBName() {
  const nameEnvMap = {
    test: () => `${getDbLocalBaseName()}Test`,
    development: () => getDbLocalBaseName(),
    production: () => process.env.DB_NAME,
  };

  return nameEnvMap[process.env.NODE_ENV]();
}

module.exports = { getDBName };
