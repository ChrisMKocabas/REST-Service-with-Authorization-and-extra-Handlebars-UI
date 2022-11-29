var express = require("express");
var mongoose = require("mongoose");
var app = express();

// //connect to database
var db = require("./db");

//import and configure cors
const cors = require("cors");
app.use(cors({ origin: "*" }));

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

// Initialize built-in middleware for urlencoding and json
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// set the static folder
router.use(express.static(path.join(__dirname, "public")));

// TODO ADD ALL ROUTES HERE, USE EXPRESS ROUTER
app.use("/", router);

// root route
router.get("/", (req, res) =>
  res.render("index", { name: "Muhammed Kocabas", id: "N01475765" })
);

router.route("/allData").get((req, res) => {
  db.Restaurant.find((err, restaurants) => {
    // if there is an error retrieving, send the error otherwise send data
    if (err) res.send(err);
    res.render("get-all", { data: restaurants });
  }).lean();
});

//list all restaurants
// db.Restaurant.find((err, restaurants) => {
//   // if there is an error retrieving, send the error otherwise send data
//   if (err) res.send(err);

//   console.log(restaurants);
// });

//this one is for creating a web-form to add restaurant - EXTRA
router.route("/api/add-restaurant").get((req, res) => {
  res.render("add-restaurant");
});

//List found restaurants (work in progress)
router
  .route("/api/restaurants")
  .get((req, res) => {
    const { page, perPage, borough = /^(?!\s*$).+/ } = req.query;
    console.log(page, perPage, borough);

    console.log("getting results");
    const filteredRestaurants = db.getAllRestaurants(page, perPage, borough);
    console.log(filteredRestaurants);
    res.render("get-all", { data: filteredRestaurants });

    res.render("error", { message: err });
  })

  //Create new restaurant
  .post((req, res) => {
    console.log(req.body);
    //populate all fields of new restaurant
    let data = {
      restaurant_id: req.body.restaurant_id,
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
      address: {
        building: req.body.borough,
        coord: [parseInt(req.body.coordx), parseInt(req.body.coordy)],
        street: req.body.street,
        zipcode: req.body.zipcode,
      },
      grades: [
        {
          date: req.body.date,
          grade: req.body.grade,
          score: req.body.score,
        },
      ],
    };

    db.addNewRestaurant(data);
  });

//find and update a restaurant by id
let id = "5eb3d668b31de5d588f429b8";
var data = {
  address: {
    building: "98-33",
    coord: [-73, 40],
    street: "Test Road",
    zipcode: "m5v3y3",
  },
  borough: "Scarborough",
  cuisine: "Sicilian",
  grades: [
    { date: "2014-11-24T00:00:00.000+00:00", grade: "zzzzz", score: 999 },
    { date: "2022-01-17T00:00:00.000+00:00", grade: "woow", score: 888 },
  ],
  name: "Don Muhammed",
};
// db.updateRestaurantById(data, id);

//Connect to DB and Start Server
async function startServer() {
  try {
    await db.initialize(db.database);
    if (mongoose.connection.readyState == 1) {
      app.listen(port);
      console.log("App listening on port : " + port);
    }
  } catch (err) {
    console.log(err);
  }
}

startServer();