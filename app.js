var express = require("express");
var mongoose = require("mongoose");
var app = express();

//import and configure cors
const cors = require("cors");
app.use(cors({ origin: "*" }));

//connecting to database.js
const db = require("./db")
const restaurants ="data";
const sample_restaurants ="restaurants";


var database = require("./config/database");
var bodyParser = require("body-parser"); // pull information from HTML POST (express4)
// import path
var path = require("path");
//import configuration
require("dotenv").config();
// instantiate Express
var app = express();
//import fs
const fs = require("fs");
// import express handlebars
const exphbs = require("express-handlebars");

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

//use this type of engine creation whenever you want to use custom helpers
const HBS = exphbs.create({
  extname: ".hbs",
  // custom helpers
  helpers: {
    strong: function (options) {
      return "<strong>" + options.fn(this) + "</strong>";
    },
  },
});

//import express router
const router = express.Router();

// declare the templating engine and its extension
app.engine(".hbs", HBS.engine);

// set the view engine
app.set("view engine", "hbs");

// Initialize built-in middleware for urlencoding and json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// set the static folder
app.use(express.static(path.join(__dirname, "public")));

//connect to database
mongoose.connect(database.url);

//restaurant model
var Restaurant = require("./models/restaurant");

// TODO ADD ALL ROUTES HERE, USE EXPRESS ROUTER

app.listen(port);
console.log("App listening on port : " + port);
