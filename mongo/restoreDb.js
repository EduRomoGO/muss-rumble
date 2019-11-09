'use strict';

const shell = require('shelljs');
const fs = require('fs');

const getCollectionNames = (dumpLocation) => new Promise((resolve, reject) => {
  fs.readdir(dumpLocation, (err, files) => {
    if (err) {
      console.log(`err reading dumplocation ${dumpLocation} folder`, err);
      reject(err);
    }

    resolve(files.filter(x => x.includes('bson')).map(x => x.replace('.bson', '')));
  });
});

module.exports = async ({ dumpLocation, getDBName, connect, dropDb, collectionNames, dbData}) => {
  function restoreAll(collectionNames) {
    console.info('restoring collections');
    collectionNames.forEach(restore);
  }

  const buildRestoreCommand = (collectionName) => {
    const { dbHost = '127.0.0.1', dbName, dbUser, dbPass } = dbData;

    return `mongorestore -h ${dbHost} -d ${dbName || getDBName()} ${dbUser ? `-u ${dbUser}` : ''} ${dbPass ? `-p ${dbPass}` : ''} -c ${collectionName} ${dumpLocation}/${collectionName}.bson`;
  }

  const runRestoreCommand = restoreCommand => {
    if (shell.exec(restoreCommand).code !== 0) {
      shell.echo('Error: mongo restore failed');
      shell.exit(1);
    }
  };

  function restore(collectionName) {
    const restoreCommand = buildRestoreCommand(collectionName);
    runRestoreCommand(restoreCommand);
  }

  try {
    const db = await connect();
    await dropDb(db);

    collectionNames = collectionNames || await getCollectionNames(dumpLocation);
    restoreAll(collectionNames);
  } catch (err) {
    console.log(`error while restoring db ${getDBName()}`);
  }
};
