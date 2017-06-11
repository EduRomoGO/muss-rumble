'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
// import each from 'async/each';
const async = require('async');
let DB;

function getDb() {
    if (DB) return DB;
    else {
        console.error('Error: No DB connection is present');
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

function getFixtures() {
    const path = process.cwd();
    const loadFixturesPath = path + '/test/fixtures/loadFixtures.json';
    const loadFixtures = require(loadFixturesPath);

    return loadFixtures;
}

function loadFixtures (db, done) {
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
                if (err) return done(err);
                collection.insert(loadFixturesJson.collections[collection.s.name], cb);
            });
        }, done);

    });
}

function dropDb () {
    return false;
}

module.exports = {
    getDb,
    getUrl,
    connect,
    connectionSuccess,
    loadFixtures,
    dropDb
};