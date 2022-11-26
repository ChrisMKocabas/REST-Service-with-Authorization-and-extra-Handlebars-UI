var mongoose = require("mongoose");
var database = require("./config/database");

const MongoClient = require("mongodb").MongoClient;

async function initialize() {
  const client = await MongoClient.connect(database.url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });

  if (!client) return;

  try {
    const dbase = client.db("sample_restaurants");

    const res = await dbase.collection("restaurants");

    console.log("Connection established", dbase, res);
  } catch (err) {
    console.log(err);
  } finally {
    client.close();
  }
}

async function addNewRestaurant(data) {}

async function getAllRestaurants(page, perPage, borough) {}

async function getRestaurantById(Id) {}

async function updateRestaurantById(data, Id) {}

async function deleteRestaurantById(Id) {}

module.exports = {
  initialize,
  addNewRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};