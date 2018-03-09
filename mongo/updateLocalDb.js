'use strict';

var shell = require('shelljs');
const mongodb = require('mongodb');

const connectToProdDb = prodDbUri => mongodb.MongoClient.connect(prodDbUri);
const getProdCollections = prodDb => prodDb.collections();
const getCollectionNames = collections => collections.map(collection => collection.s.name);

module.exports = ({prodDbName, prodDbUri, prodDbHost, prodDbUser, prodDbPass, dumpLocation, localDbName, connect, dropDb}) => new Promise((resolve, reject) => {

    function dumpAll (collectionNames) {
        collectionNames.forEach(dump);
    }

    function dump(collectionName) {
        const mongoDump = `mongodump -h ${prodDbHost} -d ${prodDbName} -c ${collectionName} -u ${prodDbUser} -p ${prodDbPass} -o ${dumpLocation}`;
        
        if (shell.exec(mongoDump).code !== 0) {
            shell.echo(`Error: mongo dump failed for collection ${collectionName}`);
            shell.exit(1);
        }
    }

    function restoreAll(collectionNames) {
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
        .then(() => connectToProdDb(prodDbUri))
        .then(getProdCollections)
        .then(getCollectionNames)
        .then((collectionNames) => {
            console.info(collectionNames);
            dumpAll(collectionNames);
            restoreAll(collectionNames);
        })
        .then(() => resolve())
        .catch(reject);
});
