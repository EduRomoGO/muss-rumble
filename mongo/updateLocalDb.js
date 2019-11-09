'use strict';

const shell = require('shelljs');
const mongodb = require('mongodb');
const dumpDb = require('./dumpDb.js');


module.exports = ({prodDbName, prodDbUri, prodDbHost, prodDbUser, prodDbPass, dumpLocation, localDbName, connect, dropDb}) => new Promise((resolve, reject) => {
    function restoreAll(collectionNames) {
        console.info('restoring collections');
        collectionNames.forEach(restore);
    }

    function restore(collectionName) {
        const mongoRestore = `mongorestore --host=127.0.0.1 --port 27017 --collection ${collectionName} --db ${localDbName} ${dumpLocation}/${prodDbName}/${collectionName}.bson`;

        if (shell.exec(mongoRestore).code !== 0) {
            shell.echo('Error: mongo restore failed');
            shell.exit(1);
        }
    }

    connect()
        .then(dropDb)
        .then(() => dumpDb({ dbName: prodDbName, dbUri: prodDbUri, dbHost: prodDbHost, dbUser: prodDbUser, dbPass: prodDbPass, dumpLocation }))
        .then(collectionNames => restoreAll(collectionNames))
        .then(() => resolve())
        .catch(reject);
});
