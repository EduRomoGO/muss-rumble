'use strict';

const mongoUtil = require('../mongoUtil.js');
let collection;

if (process.argv[2] !== undefined) {
    collection = process.argv[2];
} else {
    console.log('Please specify as first argument the collection to find the last element in');
    process.exit();
}

mongoUtil.connect().then((db) => {

    function logResult (items) {
        console.log(items[0]);
        process.exit();
    }

    mongoUtil.findLastElementAdded(db, collection)
        .then(logResult)
        .catch(err => console.log(err));
});
