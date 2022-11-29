// load mongoose since we need it to define a model
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  address: {
    building: String,
    coord: [Number],
    street: String,
    zipcode: String,
  },
  borough: String,
  cuisine: String,
  grades: [{ type: { date: Date, grade: String, score: Number } }],
  name: String,
  restaurant_id: String,
});
module.exports = mongoose.model("Restaurant", RestaurantSchema, "restaurants");