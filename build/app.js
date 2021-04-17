"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Validator = require('jsonschema').Validator;
var MongoClient = require('mongodb').MongoClient;
var isJSON = require('is-json');
var express = require('express');
var bodyParser = require('body-parser');
var uri = "mongodb://localhost:27017/";
var client = new MongoClient(uri, { useUnifiedTopology: true });
var dbCollectionName = "banane";
var dbName = "prova";
//var tools = require('./DBresources');
var app = express();
var cors = require('cors');
app.use(bodyParser.json());
//app.use(bodyParser.json());
app.use(cors());
/*
app.use(express.json({limit: 2000000}));
app.use(express.urlencoded({limit: 2000000, extended: false}));*/
var list_schema = require('../data/list_schema.json');
var settings_schema = require('../data/settings_schema.json');
app.get('/votazione/:vUUID/liste', function (req, res) {
    console.log("/votazione/:vUUID/liste : GET called");
    try {
        var vUUID = req.params.vUUID;
        var lists = new Array();
        client.connect().then(function (client) {
            var db = client.db(dbName);
            var stream = db.collection("liste").find({ "vUUID": vUUID });
            stream.on('data', function (doc) {
                lists.push(doc);
            });
            stream.on('error', function (err) {
                console.log("failed\n");
                res.status(400).send();
            });
            stream.on('end', function () {
                console.log("success\n");
                res.status(200).send(lists);
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.get('/votazioni', function (req, res) {
    console.log("/votazioni : GET called");
    try {
        var votations = new Array();
        client.connect().then(function (client) {
            var db = client.db(dbName);
            var stream = db.collection("votazioni").find();
            stream.on('data', function (doc) {
                votations.push(doc);
            });
            stream.on('error', function (err) {
                console.log("failed\n");
                res.status(400).send();
            });
            stream.on('end', function () {
                console.log("success\n");
                res.status(200).send(votations);
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.get('/votazione/:vUUID/settings', function (req, res) {
    console.log("/votazione/:vUUID/settings : GET called");
    try {
        var votations = new Array();
        var vUUID = req.params.vUUID;
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection("votazioni").findOne({ "UUID": vUUID }).then(function (data) {
                console.log((data));
                if (data) {
                    console.log("success\n");
                    res.status(200).send(data);
                }
                else {
                    console.log("failed\n");
                    res.status(400).send();
                }
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.get('/votazione/:vUUID/liste/classifica', function (req, res) {
    console.log("/votazione/:vUUID/liste/classifica : GET called");
    try {
        var vUUID = req.params.vUUID;
        var lists = new Array();
        client.connect().then(function (client) {
            var db = client.db(dbName);
            var stream = db.collection("liste").find({ "vUUID": vUUID }).sort({ votes: -1 }).limit(3);
            stream.on('data', function (doc) {
                /*
                delete doc.image;
                */
                //delete doc.candidates;
                lists.push(doc);
            });
            stream.on('error', function (err) {
                console.log("failed\n");
                res.status(400).send();
            });
            stream.on('end', function () {
                console.log("success\n");
                res.status(200).send(lists);
            });
            /*res.status(500).send();*/
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.get('/votazione/:vUUID/liste/:UUID', function (req, res) {
    console.log("votazione/:vUUID/liste/:UUID : GET called");
    try {
        var UUID_1 = req.params.UUID;
        var vUUID_1 = req.params.vUUID;
        var list;
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection("liste").findOne({ "UUID": UUID_1, "vUUID": vUUID_1 }).then(function (data) {
                console.log((data));
                if (data) {
                    console.log("success\n");
                    res.status(200).send(data);
                }
                else {
                    console.log("failed\n");
                    res.status(400).send();
                }
            });
            /*res.status(500).send();*/
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.post('/votazione/:vUUID/liste', function (req, res) {
    console.log("/votazione/liste : POST called");
    try {
        var doc = req.body;
        var v = new Validator();
        console.log();
        if ((v.validate(doc, list_schema, { required: true }).valid)) {
            client.connect().then(function (client) {
                var db = client.db(dbName);
                if (Array.isArray(doc)) {
                    db.collection("liste").insertMany(doc);
                }
                else {
                    db.collection("liste").insertOne(doc);
                }
            });
            console.log("success\n");
            res.status(200).send(doc);
        }
        else {
            console.log("failed\n");
            /*console.log(list_schema);*/
            res.status(400).send();
        }
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.post('/votazione', function (req, res) {
    console.log("/votazione : POST called");
    try {
        var doc = req.body;
        var v = new Validator();
        console.log();
        if ((v.validate(doc, settings_schema, { required: true }).valid)) {
            client.connect().then(function (client) {
                var db = client.db(dbName);
                db.collection("votazioni").insertOne(doc);
            });
            console.log("success\n");
            res.status(200).send(doc);
        }
        else {
            console.log("failed\n");
            /*console.log(list_schema);*/
            res.status(400).send();
        }
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.put('/votazione/:vUUID/liste/:UUID', function (req, res) {
    console.log("/liste/:UUID : PUT called");
    try {
        var doc = req.body;
        var UUID_2 = req.params.UUID;
        var vUUID_2 = req.params.vUUID;
        console.log(doc);
        var v = new Validator();
        if ((v.validate(doc, list_schema, { required: true }).valid)) {
            client.connect().then(function (client) {
                var db = client.db(dbName);
                db.collection("liste").replaceOne({ "UUID": UUID_2, "vUUID": vUUID_2 }, doc, {}).then(function (result) {
                    if (result.modifiedCount === 1) {
                        console.log("success\n");
                        res.status(200).send(doc);
                    }
                    else {
                        console.log("failed\n");
                        res.status(400).send(doc);
                    }
                });
            });
        }
        else {
            console.log("failed\n");
            res.status(400).send();
        }
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.put('/votazione/:vUUID/settings', function (req, res) {
    console.log("/votazione/:vUUID/settings : PUT called");
    try {
        var vUUID_3 = req.params.vUUID;
        var doc = req.body;
        /* console.log(doc);
         console.log(settings_schema);*/
        var v = new Validator();
        if ((v.validate(doc, settings_schema, { required: true }).valid)) {
            client.connect().then(function (client) {
                var db = client.db(dbName);
                db.collection("votazioni").replaceOne({ "UUID": vUUID_3 }, doc, { upsert: true }).then(function (result) {
                    if (result.modifiedCount == 1) {
                        res.status(200).send(doc);
                        console.log("success\n");
                    }
                    else {
                        console.log("failed 1\n");
                        res.status(400).send();
                    }
                });
            });
        }
        else {
            console.log("failed 1\n");
            res.status(400).send();
        }
    }
    catch (e) {
        console.log("failed 2\n");
        res.status(400).send();
    }
});
/*
app.patch('/liste/:UUID', function(req:Request, res:Response) {
  
  try{
    var doc=req.body;
    const UUID=req.params.UUID;
    console.log(doc);

    client.connect().then((client:any)=>{
      var db = client.db(dbName);
      db.collection("liste").updateOne({"UUID":UUID},doc,{ upsert: true }).then((result:any)=>{
        res.status(200).send(doc);
      });
    });
  }
  catch(e){
    res.status(400).send(e);
  }
  //tools.dbInsert(doc);
  
    
});*/
app.patch('/votazione/:vUUID/liste/:UUID/vote', function (req, res) {
    console.log("/votazione/:vUUID/liste/:UUID/vote : PATCH called");
    try {
        var UUID = req.params.UUID;
        var vUUID = req.params.vUUID;
        var filters = {
            "UUID": UUID,
            "vUUID": vUUID
        };
        var query = {
            $inc: {
                votes: 1,
                "candidates.$[element].votes": 1
            }
        };
        var options = req.body;
        /*var options={
          multi: true,
          arrayFilters: [
              {
                $or:[{
                  "element.UUID": "6f9b3b4e-1176-42fe-b780-d65a83244b45"
                },
                {
                  "element.UUID": "6g9b3b4e-1176-42fe-b780-d65a83244b45"
                }]
                
              }
          ]
        };*/
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection("liste").updateOne(filters, query, options).then(function (result) {
                if (result.modifiedCount == 1) {
                    console.log("success\n");
                    res.status(200).send();
                }
                else {
                    console.log("failed\n");
                    //console.log(filters);
                    res.status(400).send();
                }
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send(e);
    }
    //tools.dbInsert(doc);
});
app.delete('/votazione/:vUUID/liste/:UUID', function (req, res) {
    console.log("/votazione/:vUUID/liste/:UUI : DELETE called");
    try {
        var UUID_3 = req.params.UUID;
        var vUUID_4 = req.params.vUUID;
        var list;
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection("liste").deleteOne({ "UUID": UUID_3, "vUUID": vUUID_4 }).then(function (result) {
                //console.log((result));
                if (result.deletedCount == 1) {
                    console.log("success\n");
                    res.status(200).send(result);
                }
                else {
                    console.log("failed\n");
                    res.status(400).send();
                }
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.delete('/votazione/:vUUID', function (req, res) {
    console.log("/votazione/:vUUID : DELETE called");
    try {
        var vUUID_5 = req.params.vUUID;
        client.connect().then(function (client) {
            var db = client.db(dbName);
            db.collection("votazioni").deleteOne({ "UUID": vUUID_5 }).then(function (result) {
                //console.log((result));
                if (result.deletedCount == 1) {
                    console.log("success\n");
                    res.status(200).send(result);
                }
                else {
                    console.log("failed\n");
                    res.status(400).send();
                }
            });
        });
    }
    catch (e) {
        console.log("failed\n");
        res.status(400).send();
    }
});
app.listen(3000, function () {
    console.log('App listening on port 3000!');
});
//# sourceMappingURL=app.js.map