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
const router = express.Router(); //import express router
var db = require("./db"); //connect to database

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

//import and initialize cookie-session
var cookieSession = require("cookie-session");
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.KEY],
    // Cookie Options
    maxAge: 365 * 24 * 60 * 60 * 1000, 
  })
);

// const bcrypt = require('bcrypt');
// const salt =10;

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

var port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: "application/vnd.api+json" })); // parse application/vnd.api+json as json

// import express handlebars
const exphbs = require("express-handlebars");

//use this type of engine creation whenever. you want to use custom helpers
const HBS = exphbs.create({
  extname: ".hbs",
  // custom helpers
  helpers: {
    strong: function (options) {
      return "<strong>" + options.fn(this) + "</strong>";
    },
  },
});

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
app.use(methodOverride("_method"));
// set the static folder
router.use(express.static(path.join(__dirname, "public")));

// TODO ADD ALL ROUTES HERE, USE EXPRESS ROUTER
app.use("/", router);

router.use(cors({ origin: "*" }));


// root route
router.get("/", (req, res) => res.render("index", { name: "" }));

/* 

----- FRONT END ROUTES START -----

*/

//WEB FORM ROUTE - render a webpage to login
router.route("/login").get((req, res) => {
  res.render("login");
});


//WEB FORM ROUTE - render a web page with handlebars to add restaurant -> form submit calls /api/restaurantsadd
router.route("/api/add-restaurant").get((req, res) => {
  res.render("add-restaurant");
});

//WEB ROUTE - render a web page with found restaurant
router.route("/api/find-restaurant/:id").get((req, res) => {
  const id = req.params.id;
  (async function () {
    try {
      console.log("getting results");
      const filteredRestaurants = await db.Restaurant.findById(id)
        .lean()
        .exec();
      console.log(filteredRestaurants);
      res.render("get-all", { data: [filteredRestaurants] });
      // res.send(filteredRestaurants);
    } catch (err) {
      res.render("error", {
        message: "Please check ID input and try again.",
      });
    }
  })();
});

//WEB FORM ROUTE - render a web page using handlebars to update restaurant -> form submit calls /api/restaurants PUT
router.route("/api/update-restaurant/:id").get((req, res) => {
  (async () => {
    try {
      let rest = await db.Restaurant.findById(req.params.id).lean().exec();
      console.log(rest);
      if (rest._id == req.params.id)
        res.render("update-restaurant", {
          data: req.params.id,
          fields: rest,
        });
    } catch (err) {
      res.render("error", { message: "Please check input ID and try again!" });
    }
  })();
});

//WEB FORM ROUTE - render a web form through through handlebars to update restaurant -> form submit calls /api/restaurants DELETE
router.route("/api/delete-restaurant/:id").get((req, res) => {
  (async () => {
    try {
      let rest = await db.Restaurant.findById(req.params.id).lean().exec();
      console.log(rest);
      if (rest._id == req.params.id)
        res.render("delete-restaurant", {
          data: req.params.id,
          fields: rest,
        });
    } catch (err) {
      res.render("error", { message: "Please check input ID and try again!" });
    }
  })();
});

//WEB ROUTE - render a web form to filter restaurants by page, perpage and borough -> form submit calls itself
router.route("/api/restaurants/").get((req, res) => {
  const page = parseInt(req.body.page) || req.query.page || 1;
  const perPage = parseInt(req.body.perpage) || req.query.perpage || 5;
  const borough = req.query.borough || req.query.borough || "";
  console.log(page, perPage, borough);
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
      res.render("get-by-page-perpage-borough", {
        data: filteredRestaurants,
        details: { page, perPage, borough },
      });
      // res.send(filteredRestaurants);
    } catch (err) {
      console.log(err);
    }
  })();
});

/* 

----- FRONT END ROUTES END -----

*/


//API ROUTE - login to confirm authorized user and create cookie-session
router
  .route("/login")
  .post((req, res) => {
    (async function () {
      try {
        const { user, password } = req.body;
    
            await user.findOne({
              where: {
                user: req.body.userlogin
              }
            })
            if (user != userlogin && password != passwordlogin){
              res.render("error", {
                  message: "User details incorrect."}) 
            } else {
              req.session.views = (req.session.views || 0) + 1

              res.end(req.session.views + ' views')
            }
      } catch {

      }
    })
  })
  // .route("/login")
  // .post((req, res) => {
  //   
  //       const { user, password } = req.body;
  //       const username = await user.findOne({user});

  //       if (username && (await bcrypt.compare(password, user.password))) {
          
  //       } else {
  //         res.render("error", {
  //           message: "User details incorrect."}) 
          
  //       }
  //     } catch (err) {
  //         console.log(err);
  //       }
  //     })();
  //   })
  // .post('/login', (req, res, next) => {

  //   (async function () {
      
  //     const { user, password } = req.body;
    
  //     await user.findOne({
  //       where: {
  //         user: req.body.user
  //       }
  //     })
  //     .then(user => {
  //       if(!user) {
  //         return next({ status: 401 })
  //       }
  //       else {
  //         bcrypt.compare(req.body.password, user.password, (error, result) => {
  //           if(result) {
  //             res.send(user)
  //           }
  //           else {
  //             console.log(error)
  //             return next({ status: 401 })
  //           }
  //         })
  //       }
  //     })
  //     .catch(error => next(error));
  //   })
  // })


//API ROUTE - Get all restaurants by page, perPage and optionally borough
router
  .route("/api/restaurants")
  .get((req, res) => {
    const { page = 1, perPage = 5, borough = "" } = req.query;

    (async function () {
      try {
        console.log(page, perPage, borough);
        const filteredRestaurants = await db.getAllRestaurants(
          page,
          perPage,
          borough
        );
        res.send(filteredRestaurants);
      } catch (err) {
        console.log(err);
      }
    })();
  })

  //API ROUTE - Create new restaurant and SEND RESPONSE
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
        coord: [parseInt(req.body.coordx) || 0, parseInt(req.body.coordy) || 0],
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
        // res.render("get-all", { data: newRestaurant });
        res.send(newRestaurant);
      } catch (err) {
        console.log(err);
      }
    })();
  })

  //WEB ROUTE - RENDERS RESPONSE - Update a restaurant - called by update-restaurant.hbs
  .put((req, res) => {
    let id = req.body.id;

    //populate all fields of new restaurant
    let gradesArray = req.body.date.map(function (val, index) {
      return {
        date: val || new Date().toJSON().slice(0, 10).replace(/-/g, "/"),
        grade: req.body.grade[index] || "N/A",
        score: req.body.score[index] || 0,
      };
    });

    console.log(gradesArray);

    let data = {
      restaurant_id: req.body.restaurant_id,
      name: req.body.name,
      cuisine: req.body.cuisine,
      borough: req.body.borough,
      address: {
        building: req.body.borough,
        coord: [parseInt(req.body.coordx) || 0, parseInt(req.body.coordy)] || 0,
        street: req.body.street,
        zipcode: req.body.zipcode,
      },

      grades: gradesArray,
    };

    (async function () {
      try {
        let updatedRestaurant = await db.updateRestaurantById(data, id);
        console.log("Update by form");
        res.render("get-all", { data: [updatedRestaurant] });
      } catch (err) {
        console.log(err);
      }
    })();
  })

  //WEB ROUTE - RENDER RESPONSE - Delete a restaurant - called by update-restaurant.hbs
  .delete((req, res) => {
    let id = req.body.id;

    console.log(id);

    (async function () {
      try {
        let deletedRestaurant = await db.deleteRestaurantById(id);
        console.log(deletedRestaurant);
        res.render("get-all", { data: [deletedRestaurant] });
      } catch (err) {
        console.log(err);
      }
    })();
  });

//WEB ROUTE - RENDER - Create a new restaurant and render webpage response -> called by /api/add-restaurant
router.route("/api/restaurantsadd").post((req, res) => {
  console.log(req.body);
  //populate all fields of new restaurant
  let data = {
    restaurant_id: req.body.restaurant_id,
    name: req.body.name,
    cuisine: req.body.cuisine,
    borough: req.body.borough,
    address: {
      building: req.body.borough,
      coord: [parseInt(req.body.coordx) || 0, parseInt(req.body.coordy) || 0],
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
      res.render("get-all", { data: newRestaurant });
      // res.send(newRestaurant);
    } catch (err) {
      console.log(err);
    }
  })();
});

// API ROUTE - SENDS A RESPONSE AFTER FINDING A RESTAURANT BY ID
router
  .route("/api/restaurants/:id")
  .get((req, res) => {
    const id = req.params.id;
    (async function () {
      try {
        const filteredRestaurants = await db.getRestaurantById(id);
        res.send(filteredRestaurants);
      } catch (err) {
        res.render("error", {
          message: "Please check ID input and try again.",
        });
      }
    })();

    // res.render("error", { message: err });
  })

  
  // API ROUTE  - SENDS A RESPONSE AFTER FINDING AND DELETING RESTAURANT BY ID
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

  //API ROUTE - SENDS A RESPONSE AFTER FINDING AND UPDATING RESTAURANT BY ID
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
        // res.render("get-all", { data: updatedRestaurant });
        res.send(updatedRestaurant);
      } catch (err) {
        console.log(err);
      }
    })();
  });

// IF ALL FAILS RENDER AN ERROR RESPONSE
router.all("/*", (req, res) => {
  res.render("error", {
    message: "Please check your input and try again.",
  });
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
