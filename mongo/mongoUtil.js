'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
const updateLocalDbMethod = require('./updateLocalDb.js');
const {getDBName} = require('./mongoDbName.js');
const async = require('async');
const {getFixtures} = require('./fixturesUtil.js');
let DB;

const showErrorMsg = () => console.error('Error: No DB connection is present');

function getDb(options) {
    if (DB === undefined) {
        const thereAreOptions = options !== undefined;
        const silentOptionPassed = options && options.silent !== undefined;
        const shouldShowErrorMsg = thereAreOptions && silentOptionPassed ? false : true;

        if (shouldShowErrorMsg) {
            showErrorMsg();
        }
    }

    return DB;
}

function getUrl () {
    return MongoUrl.get();
}

function connect(options) {
    return new Promise ((resolve, reject) => {
        (getDb() !== undefined) ? 
        resolve(getDb()) :
        MongoClient.connect(getUrl())
            .then((db) => {
                connectionSuccess(options);
                DB = db;
                resolve(db);
            })
            .catch((err) => reject(err));
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

function loadFixtures (db, fixtures) {
    const loadFixturesJson = fixtures || getFixtures();

    return new Promise ((resolve, reject) => {
        const collections = Object.keys(loadFixturesJson.collections);

        async.each(collections, function(collection, cb) {
            db.createCollection(collection, function(err, collection) {
                if (err) reject(err);
                collection.insert(loadFixturesJson.collections[collection.s.name], cb);
            });
        }, err => err ? reject(err) : resolve());
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

const updateAndGetNextSequence = (db, collection) => new Promise((resolve, reject) => {
    db.collection('counters')
        .findOneAndUpdate(
            { _id: collection },
            { $inc: { seq: 1 } }
        )
        .then(result => (result.value) ? resolve(result) : db.collection('counters').insertOne({ _id: collection, seq: 2 }))
        .then(() => resolve({value: {seq: 1}}))
        .catch(reject);
});

function changeGeneratedIdsToSequentialIds (db, collection) {

    function removeItem(item) {
        return db.collection(collection).removeOne({_id: item._id});
    }

    function addItem (item) {
        return db.collection(collection).insertOne(item);
    }

    function updateItems (items) {
        return new Promise((resolve, reject) => {
            async.eachOf(items, function(item, index, cb) {
                removeItem(item)
                .then(()=> {
                    item._id = index + 1;
                    return addItem(item);
                })
                .then(()=>cb())
                .catch(err => reject(err));
            }, function (err) {
                if (err) {reject(err);}
                else { resolve(); }
            });
        });
    }
    
    function getCollectionItems () {        
        return db.collection(collection).find().toArray();
    }


    return new Promise ((resolve, reject) => {
        getCollectionItems()
        .then(updateItems)
        .then(resolve)
        .catch(err => reject(err));    
    });
}

function findLastElementAdded(db, collection) {
    const query = [
        { "$sort": {"timeStamp": -1} },
        { "$limit": 1 }
    ];

    return db.collection(collection).aggregate(query).toArray();
}

module.exports = {
    getDb,
    getUrl,
    connect,
    connectionSuccess,
    loadFixtures,
    dropDb,
    closeConnection,
    updateAndGetNextSequence,
    changeGeneratedIdsToSequentialIds,
    getDBName,
    findLastElementAdded,
    getFixtures,
    updateLocalDb: options => updateLocalDbMethod({...options, connect, dropDb})
};