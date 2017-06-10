'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
let DB;

function getDb() {
    if (DB) return DB;
    else {
        console.error('No DB connection is present');
        process.exit();
    }
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

function loadFixtures () {
    return Promise.reject({
                msg: 'No fixtures found'
            });
}

module.exports = {
    getDb,
    getUrl,
    connect,
    connectionSuccess,
    loadFixtures
};