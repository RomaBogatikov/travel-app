const express = require('express');
const favorites = express.Router();
const mongoose = require ('mongoose');
// require Place model (collection 'places' in 'travel' database)
const Place = require('../models/places.js');
const User = require('../models/users.js');
const session = require('express-session');

require('dotenv').config();

favorites.use(session({
  secret: process.env.SECRET,
  // secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));


// index route
favorites.get('/all', async (req, res) => {
  console.log('req.session.currentUser=', req.session.currentUser);
  // res.render('favorites/index.ejs', {
  //   places: req.session.currentUser
  // });
  try {
    let user = await User.findById(req.session.currentUser._id);
    let places = await Place.find({
      // '_id': { $in: req.session.currentUser.places_id }
      '_id': {$in: user.places_id}
    }, (err, foundPlaces) => {
      if (err) {
        console.log(err);
      } else {
        console.log('foundPlaces=', foundPlaces);

      }
    });
    console.log('places=', places);
    res.render('favorites/index.ejs', {
      places: places
    })
  } catch {

  }

});

// post route
favorites.post('/all', (req, res) => {
  req.session.currentUser.places_id.push(req.body.place_id);
  console.log('/all req.body=', req.body);
  console.log('/all req.session.currentUser=', req.session.currentUser);
  // convert to ObjectId
  req.body.place_id = new mongoose.Types.ObjectId(req.body.place_id);
  // add place's id to currentUser's 'places_id' array
  User.findByIdAndUpdate(req.session.currentUser._id, {$push: {"places_id": req.body.place_id}}, {"new": true}, (err, updatedUser) => {
    if (err) {
      console.log(error);
    } else {
      console.log('updatedUser=', updatedUser);
    }
  });
});

favorites.post('/', (req, res) => {
  console.log('req.body.places_id=', req.body.places_id);
  console.log('req.session.currentUser=', req.session.currentUser);
  req.session.currentUser.places_id.splice(req.session.currentUser.places_id.indexOf(req.body.places_id), 1);
  console.log(req.session.currentUser.places_id);
  User.findByIdAndUpdate(req.session.currentUser._id, req.session.currentUser, {"new": true}, (err, updatedUser) => {
    if (err) {
      console.log(err);
    } else {
      console.log('updatedUser=', updatedUser);
      res.redirect('/travel/favorites/all');
    }
  })
})


module.exports = favorites
