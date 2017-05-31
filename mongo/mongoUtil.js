'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');

function getUrl () {
    return MongoUrl.get();
}

 function showSuccessMsg () {
    console.log(`Connected successfully to ${url}`);
}

module.exports = {

    getUrl,

    connect: function () {
        return MongoClient.connect(this.getUrl());
    },

    connectionSuccess: function () {
        showSuccessMsg();
    }

};