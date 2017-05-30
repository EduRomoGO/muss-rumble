'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
const url = MongoUrl.get();

 function showSuccessMsg () {
    console.log(`Connected successfully to ${url}`);
}

module.exports = {

    url,

    connect: function () {
        return MongoClient.connect(url);
    },

    connectionSuccess: function () {
        showSuccessMsg();
    }

};