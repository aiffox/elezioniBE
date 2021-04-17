"use strict";
var MongoClient = require('mongodb').MongoClient;
var uri = "mongodb://localhost:27017/";
var dbclient = new MongoClient(uri, { useUnifiedTopology: true });
dbclient.connect().then(function (client) {
    var db = dbclient.db('prova');
    var myobj = { name: "Comfdsfdspany Inc", address: "Highway 37" };
    db.collection('banane').insertOne(myobj);
    console.log("1 document inserted");
});
//# sourceMappingURL=test.js.map