const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  city: {type: String, required: true},
  country: {type: String, required: true},
  imgURL: String,
  comments: [String],
  coordinates: String
})

const Place = mongoose.model('Place', placeSchema);

module.exports = Place;
