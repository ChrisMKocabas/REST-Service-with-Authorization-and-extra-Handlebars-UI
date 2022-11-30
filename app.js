/******************************************************************************
***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Group member Name: Muhammed Kocabas - Tatiana Trofimcuk 
Student IDs: N01475765 N01490818 Date: 11-29-2022
******************************************************************************
***/

var express = require("express");
var mongoose = require("mongoose");
var app = express();
const helper = require("helpers");

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
  helpers: helper,
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
router.get("/", (req, res) => res.render("index", { name: "" }));

//render a web form through through handlebars to add restaurant - EXTRA
router.route("/api/add-restaurant").get((req, res) => {
  res.render("add-restaurant");
});

//Get all restaurants by page, perPage and optionally borough
router
  .route("/api/restaurants")
  .get((req, res) => {
    const { page, perPage, borough = "" } = req.query;

    (async function () {
      try {
        console.log("getting results");
        console.log(page, perPage, borough);
        const filteredRestaurants = await db.getAllRestaurants(
          page,
          perPage,
          borough
        );
        console.log(filteredRestaurants);
        res.render("get-all", { data: filteredRestaurants });
        // res.send(filteredRestaurants);
      } catch (err) {
        console.log(err);
      }
    })();

    // res.render("error", { message: err });
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

    (async function () {
      try {
        let newRestaurant = await db.addNewRestaurant(data);
        console.log("Here");
        res.render("get-all", { data: newRestaurant });
        // res.send(newRestaurant);
      } catch (err) {
        console.log(err);
      }
    })();
  });

router
  .route("/api/restaurants/:id")
  .get((req, res) => {
    const id = req.params.id;
    (async function () {
      try {
        console.log("getting results");
        const filteredRestaurants = await db.getRestaurantById(id);
        console.log(filteredRestaurants);
        res.render("get-all", { data: [filteredRestaurants] });
        // res.send(filteredRestaurants);
      } catch (err) {
        console.log(err);
      }
    })();

    // res.render("error", { message: err });
  })

  .delete((req, res) => {
    const id = req.params.id;
    (async function () {
      try {
        console.log("preparing for deletion");
        const filteredRestaurants = await db.deleteRestaurantById(id);
        console.log(filteredRestaurants);
        // res.render("get-all", { data: [filteredRestaurants] });
        res.send(filteredRestaurants);
      } catch (err) {
        console.log(err);
      }
    })();
  })

  //update a restaurant
  .put((req, res) => {
    let id = req.params.id;

    // const id = req.params.id;
    console.log(id);
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

    (async function () {
      try {
        let updatedRestaurant = await db.updateRestaurantById(data, id);
        res.render("get-all", { data: updatedRestaurant });
      } catch (err) {
        console.log(err);
      }
    })();
  });

//Connect to DB and Start Server
async function startServer() {
  try {
    await db.initialize(db.database);
    if (mongoose.connection.readyState == 1) {
      app.listen(port);
      console.log("Server listening on port : " + port);
    }
  } catch (err) {
    console.log(err);
  }
}

startServer();