const express = require('express');
const favorites = express.Router();
const mongoose = require ('mongoose');
const Place = require('../models/places.js');
const User = require('../models/users.js');

require('dotenv').config();

// index route (to display the list of favorites of a specified user)
favorites.get('/all', async (req, res) => {
  try {
    // find a user by id
    let user = await User.findById(req.session.currentUser._id);
    // find a list of favorite places of a specified user
    let places = await Place.find({
      '_id': {$in: user.places_id}
    }, (err, foundPlaces) => {
      if (err) {
        console.log(err);
      } else {
        console.log('foundPlaces=', foundPlaces);

      }
    });

    // render the list of favorites of a specified user
    res.render('favorites/index.ejs', {
      places: places,
      currentUser: req.session.currentUser
    })
  } catch (err) {
    console.log(err);
  }

});

// post route (to add favorites to a list of favorite places of a specified user)
favorites.post('/all', async (req, res) => {
  try {
    req.session.currentUser.places_id.push(req.body.place_id);
    // find the user by id
    let user = await User.findById(req.session.currentUser._id);
    console.log('user=', user);

    // if the plase is not on the list of favorites of a specified user
    if (!user.places_id.includes(req.body.place_id)) {
      // add a place to the list of favorites
      User.findByIdAndUpdate(req.session.currentUser._id, {$push: {"places_id": req.body.place_id}}, {"new": true}, (err, updatedUser) => {
        if (err) {
          console.log(error);
        } else {
          console.log('updatedUser=', updatedUser);
        }
      });
      // otherwise, display a message that a place is already on the list of favorites
    } else {
      console.log('already in the favorites');
      res.send('<a href="/travel">This destination is in your favorites already</a>');
    }

  } catch(err) {
    console.log(err);
  }
});

// to remove place from the list of favorite places of a specified user
favorites.post('/', async (req, res) => {
  try {
    // splice the removed place from currentUser places id list
    req.session.currentUser.places_id.splice(req.session.currentUser.places_id.indexOf(req.body.places_id), 1);
    // splice the removed place from the specified user places id list
    let user = await User.findById(req.session.currentUser._id);
    user.places_id.splice(user.places_id.indexOf(req.body.places_id), 1);
    User.findByIdAndUpdate(req.session.currentUser._id, user, {"new": true}, (err, updatedUser) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updatedUser=', updatedUser);
        res.redirect('/travel/favorites/all');
      }
    })
  } catch (err) {
    console.log(err);
  }

})


module.exports = favorites
