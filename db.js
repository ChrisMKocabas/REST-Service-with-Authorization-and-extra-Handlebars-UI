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
    //code here
  } catch {
    //catch errors
  }
}

//Tati
async function getAllRestaurants(
  page,
  perPage,
  borough = /^(?!\s*$).+/
  /*borough will match all entries and bring all, if no borough specified*/
) {
  try {
    //code here
  } catch {
    //catch errors
  }
}

//Tati
async function getRestaurantById(Id) {
  try {
    //code here
  } catch {
    //catch errors
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
