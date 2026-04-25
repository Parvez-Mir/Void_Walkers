const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
  type: String,
  name: String,
  distance: Number,
  location: {
    lat: Number,
    lng: Number
  },
  travelTime: {
    car: Number
  }
});

const propertySchema = new mongoose.Schema({
   _id: {
    type: String
  },
  title: String,
  city: String,
  price: Number,
  location: {
    lat: Number,
    lng: Number
  },
  nearbyPlaces: [placeSchema]
});

module.exports = mongoose.model("Property", propertySchema);