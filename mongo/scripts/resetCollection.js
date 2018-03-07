'use strict';

const mongoUtil = require('../mongoUtil.js');
let collection;

if (process.argv[2] !== undefined) {
    collection = process.argv[2];
} else {
    console.log('Please specify collection to reset as first argument');
    process.exit();
}

mongoUtil.connect().then((db) => {

    function clearCollection() {
        return db.collection(collection).remove({});
    }

    function restartIds () {
        return db.collection('counters').update({_id: collection}, {$set: {seq: 1}});
    }

    function logResult () {
        console.log(`${collection} collection reseted successfully`);
        process.exit();
    }

    clearCollection()
        .then(restartIds)
        .then(logResult)
        .catch(err => console.log(err));
});
