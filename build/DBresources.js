"use strict";
var MongoClient = require('mongodb').MongoClient;
var isJSON = require('is-json');
var uri = "mongodb://localhost:27017/";
var client = new MongoClient(uri, { useUnifiedTopology: true });
var dbCollectionName = "banane";
var dbName = "prova";
module.exports = {
    dbInsert: function (doc) {
        client.connect().then(function (client) {
            var db = client.db(dbName);
            if (Array.isArray(doc)) {
                db.collection(dbCollectionName).insertMany(doc);
                console.log("documents inserted");
            }
            else {
                db.collection(dbCollectionName).insertOne(doc);
                console.log("document inserted");
            }
        });
    },
    dbFindOne: function (doc) {
        client.connect().then(function (client) {
            var db = client.db(dbName);
            var result = db.collection(dbCollectionName).findOne(doc, function (err, result) {
                if (err)
                    throw err;
                console.log(result);
            });
            console.log("Find: ", result);
        });
    },
    dbFindAll: function (doc) {
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection(dbCollectionName).insertAll(doc);
            console.log("Find: ");
        });
    }
};
//# sourceMappingURL=DBresources.js.map