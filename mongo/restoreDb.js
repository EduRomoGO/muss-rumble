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

module.exports = async ({restoreLocalDb, dumpLocation, getDBName, connect, dropDb, collectionNames}) => {
  function restoreAll(collectionNames) {
    console.info('restoring collections');
    collectionNames.forEach(restore);
  }

  const buildRestoreCommand = (collectionName) => {
    let mongoRestore;

    if (restoreLocalDb) {
      mongoRestore = `mongorestore --host=127.0.0.1 --port 27017 --collection ${collectionName} --db ${getDBName()} ${dumpLocation}/${collectionName}.bson`;
    }

    return mongoRestore;
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
