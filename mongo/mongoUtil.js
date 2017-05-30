'use strict';

const MongoClient = require('mongodb').MongoClient;
const MongoUrl = require('./MongoUrl.js');
const mongoUrl = MongoUrl.get();

 function showSuccessMsg () {
    console.log("Connected successfully to mongodb url: ", mongoUrl);
}

module.exports = {
    connect: function () {
        return MongoClient.connect(mongoUrl);
    },

    connectionSuccess: function () {
        showSuccessMsg();
    }
};