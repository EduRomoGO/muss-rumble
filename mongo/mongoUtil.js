'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
// import each from 'async/each';
const async = require('async');
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

function getFixtures() {
    const path = process.cwd();
    const loadFixturesPath = path + '/test/fixtures/loadFixtures.json';
    const loadFixtures = require(loadFixturesPath);

    return loadFixtures;
}

function loadFixtures (db) {
    const loadFixturesJson = getFixtures();

    // loadFixturesJson.collections.bets.forEach(function (bet) {
    //     db.collection('bets').insertOne(bet);
    // });

    // return Promise.reject({
    //             msg: 'No fixtures found'
    //         });

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

function closeConnection () {
    return new Promise((resolve, reject) => {
        if (getDb() !== undefined) {
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