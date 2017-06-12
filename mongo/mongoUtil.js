'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
const async = require('async');
const {getFixtures} = require('./fixturesUtil.js');
let DB;

function getDb(options) {
    if (DB === undefined) {
        const silentOptionPassed = options !== undefined && !options.silent;

        if (options === undefined || silentOptionPassed) {
            console.error('Error: No DB connection is present'); 
        }
    }

    return DB;
}

function getUrl () {
    return MongoUrl.get();
}

function connect(options) {
    return new Promise ((resolve, reject) => {
        MongoClient.connect(getUrl())
            .then((db) => {
                connectionSuccess(options);
                DB = db;
                resolve(db);
            })
            .catch((err) => console.log(err));
    });
}

function connectionSuccess (options) {
    const silentOptionPassed = options !== undefined && !options.silent;

    if (options === undefined || silentOptionPassed) {
        showSuccessMsg();
    }
}

 function showSuccessMsg () {
    console.log(`Connected successfully to ${getUrl()}`);
}

function loadFixtures (db) {
    const loadFixturesJson = getFixtures();

    return new Promise ((resolve, reject) => {
        const collections = Object.keys(loadFixturesJson.collections);

        async.each(collections, function(collection, cb) {
            db.createCollection(collection, function(err, collection) {
                if (err) return reject(err);
                collection.insert(loadFixturesJson.collections[collection.s.name], cb);
            });
        }, resolve);

    });
}

function dropDb (db) {
    return new Promise((resolve, reject) => {
        db.collections().then((collections) => {
            async.each(collections, function (collection, cb) {
                db.dropCollection(collection.s.name, cb);
            }, resolve);
        });
    });
}

function closeConnection (options) {
    return new Promise((resolve, reject) => {
        if (getDb(options) !== undefined) {
            getDb().close(true).then(() => {
                DB = undefined;
                resolve();
            });
        } else {
            resolve();
        }
    });
}

module.exports = {
    getDb,
    getUrl,
    connect,
    connectionSuccess,
    loadFixtures,
    dropDb,
    closeConnection
};