import { Request, Response } from "express";

var Validator = require('jsonschema').Validator;
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
const cors=require('cors');

var uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri, {useUnifiedTopology: true});

var dbName="prova"


var app = express();
app.use(bodyParser.json());
app.use(cors());

var product_schema = require('../data/product_schema.json');

app.post('/product', function(req:Request, res:Response) {
  console.log("/product : POST called");
  try{
    var doc=req.body;

    var v = new Validator();
    console.log();
    if((v.validate(doc, product_schema, {required: true}).valid)){
      client.connect().then((client:any)=>{
        var db = client.db(dbName);
        var result=db.collection("product").insertOne(doc);
          
      });
      console.log("success\n");
      res.status(200).send(doc);
    }
    else{
      console.log("failed\n");
      /*console.log(list_schema);*/
      console.log(doc);
      res.status(400).send("document is not valid");
    }
  }
  catch(e){
    console.log("failed\n");
    res.status(400).send("Exception detected");
  }
});



app.listen(3000, function () {
    console.log('App listening on port 3000!');
  });