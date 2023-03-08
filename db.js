

var mongoose = require("mongoose");
// var database = require("./config/database");
require("dotenv").config();
const database = { url: process.env.url1 };
const restaurant = require("./models/restaurant");
var Restaurant = require("./models/restaurant");

//Muhammed
const initialize = async function initialize(db) {
  try {
    console.log("Connecting to the database...");
    console.log(database);
    await mongoose.connect(db.url);
    console.log("Connection established.");
    var Restaurant = require("./models/restaurant");
    return Restaurant;
  } catch (err) {
    console.log("Failed to connect to Atlas!", err);
  }
};

//Tati
async function addNewRestaurant(data) {
  try {
    const newRestaurant = await Restaurant.create(data);
    const findNewRestaurant = await Restaurant.find({
      restaurant_id: newRestaurant.restaurant_id,
    })
      .lean()
      .exec();
    return findNewRestaurant;
  } catch (err) {
    console.log("Unable to add new restaurant.", err);
  }
}

//Tati
async function getAllRestaurants(
  page,
  perPage,
  borough
  /*borough will match all entries and bring all, if no borough specified   = /^(?!\s*$).+/*/
) {
  try {
    //code here
    //if borough not provided
    if (borough == "") {
      try {
        // all restaurants 1) sorted by restaurant_id, 2) by indicated page, 3) indicated limit PerPage
        const restaurantsById = await Restaurant.find()
          .lean()
          .sort({ restaurant_id: +1 })
          .skip(page)
          .limit(+perPage)
          .exec();
        return restaurantsById;
      } catch (err) {
        console.log("Required parameters missing.", err);
      }
    } else {
      try {
        //all restaurants fitered by specific borough provided
        // 1) sorted by restaurant_id, 2) by indicated page, 3) indicated limit PerPage
        console.log(borough);
        const restaurantsByBorough = await Restaurant.find({
          borough: borough,
        })
          .lean()
          .sort({ restaurant_id: +1 })
          .skip(page)
          .limit(+perPage)
          .exec();
        return restaurantsByBorough;
      } catch (err) {
        console.log("Required parameters missing.", err);
      }
    }
  } catch (err) {
    console.log("there was a problem. Unable to get and restaurants");
  }
}

//Tati
async function getRestaurantById(Id) {
  try {
    const restaurant = await Restaurant.findById(Id).lean().exec();
    return restaurant;
  } catch (err) {
    console.log("Unable to find restaurant.");
  }
}

//Muhammed
async function updateRestaurantById(data, Id) {
  try {
    let restaurant = await Restaurant.findByIdAndUpdate({ _id: Id }, data, {
      new: true,
    })
      .lean()
      .exec();
    return restaurant;
  } catch (err) {
    console.log("Unable to update restaurant.", err);
  }
}

//Muhammed
async function deleteRestaurantById(Id) {
  try {
    // const deletedRestaurant = await find;
    const deletedRestaurant = await Restaurant.findByIdAndRemove(Id)
      .lean()
      .exec();
    console.log(`${deletedRestaurant.name} was deleted successfully.`);
    return deletedRestaurant;
  } catch (err) {
    console.log("Unable to delete restaurant.", err);
  }
}

module.exports = {
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
  database,
  Restaurant,
};
