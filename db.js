var mongoose = require("mongoose");
var database = require("./config/database");
const restaurant = require("./models/restaurant");
var Restaurant = require("./models/restaurant");

//Muhammed
const initialize = async function initialize(db) {
  try {
    await mongoose.connect(db.url);
    var Restaurant = require("./models/restaurant");
    return Restaurant;
  } catch (err) {
    console.log("Failed to connect to Atlas!", err);
  }
};

//Tati
async function addNewRestaurant(data) {
  try {
    const newRestaurant = await Restaurant.save()
    return newRestaurant;
  } catch (err) {
    console.log("Unable to add new restaurant.", err);
  }
}

//Tati
async function getAllRestaurants(
  page,
  perPage,
  borough = /^(?!\s*$).+/
  /*borough will match all entries and bring all, if no borough specified*/
) {
  
  //if borough not provided
  if(borough = "") {

    try {
      // all restaurants 1) sorted by restaurant_id, 2) by indicated page, 3) indicated limit PerPage
      const restaurantsById = await Restaurant.find(Id).sort({restaurant_id: -1 }).skip(page).limit(+perPage).exec()
      return restaurantsById;
    } catch (err) {
      console.log("Required parameters missing.", err);
    }
  } else {
    try {
      //all restaurants fitered by specific borough provided
      // 1) sorted by restaurant_id, 2) by indicated page, 3) indicated limit PerPage
      const restaurantsByBorough = await Restaurant.find(borough).sort({restaurant_id: -1 }).skip(page).limit(+perPage).exec()
      return restaurantsByBorough;
    } catch (err) {
      console.log("Required parameters missing.", err);
    }
  }
}

//Tati
async function getRestaurantById(Id) {

  try {
    const restaurant = await Restaurant.find(Id).exec();
    return restaurant;
  } catch (err) {
    console.log("Unable to find restaurant.", err);
  }
}

//Muhammed
async function updateRestaurantById(data, Id) {
  try {
    await Restaurant.findByIdAndUpdate(Id, data);
    const restaurant = await data.name;
    console.log(restaurant);
    return restaurant;
  } catch (err) {
    console.log("Unable to update restaurant.", err);
  }
}

//Muhammed
async function deleteRestaurantById(Id) {
  try {
    // const deletedRestaurant = await find;
    const deletedRestaurant = await Restaurant.findByIdAndRemove(Id).exec();
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