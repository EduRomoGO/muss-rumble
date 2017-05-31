'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');

function getUrl () {
    return MongoUrl.get();
}

function connect() {
    return MongoClient.connect(getUrl());
}

function connectionSuccess () {
    showSuccessMsg();
}


 function showSuccessMsg () {
    console.log(`Connected successfully to ${url}`);
}

module.exports = {
    getUrl,
    connect,
    connectionSuccess
};