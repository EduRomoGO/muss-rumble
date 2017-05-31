'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
let DB;

function getDb() {
    return DB;
}

function getUrl () {
    return MongoUrl.get();
}

function connect() {
    return new Promise ((resolve, reject) => {
        MongoClient.connect(getUrl())
            .then((db) => {
                connectionSuccess();
                DB = db;
                resolve(db);
            })
            .catch((err) => console.log(err));
    });
}

function connectionSuccess () {
    showSuccessMsg();
}


 function showSuccessMsg () {
    console.log(`Connected successfully to ${getUrl()}`);
}

module.exports = {
    getDb,
    getUrl,
    connect,
    connectionSuccess
};