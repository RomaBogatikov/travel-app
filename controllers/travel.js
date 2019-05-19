const express = require('express');
const router = express.Router();
const Place = require('../models/places.js');
const rp = require('request-promise');

require('dotenv').config();


// index route (to show the main page with list of all places)
router.get('/travel' , (req, res) => {
  console.log('index route');
  Place.find({}, (error, allPlaces) => {
    console.log('currentUser = ', req.session.currentUser);
    res.render('index.ejs', {
      places: allPlaces,
      currentUser: req.session.currentUser
    });
  });
});

// new route (to render a form to create a new city)
router.get('/travel/new', (req, res) => {
  if (req.session.currentUser) {
    res.render('new.ejs', {
      currentUser: req.session.currentUser
    });
  } else {
    res.redirect('/travel/sessions/new');
  }
});

// show route (to show details of a specific place)
router.get('/travel/:id', (req, res) => {

  Place.findById(req.params.id, (err, foundPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('foundplace show=', foundPlace);
      // url needed to display a Google map centered at a particular city
      const url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.GMAPS_API_KEY + "&callback=initMap";
      res.render('show.ejs', {
        place: foundPlace,
        currentUser: req.session.currentUser,
        url: url
      });
    }
  });
});

// post route (create a new place based on user input. Request longtitude and latitude of a specified city from mapquestapi.com API to center the Google map accordingly)
router.post('/travel', (req, res) => {

  // get geocoding info (latitute and longtitude of a city for centering of a google map)
  rp({
    uri: `http://open.mapquestapi.com/geocoding/v1/address?key=${process.env.MAPQUEST_API_KEY}&location=${req.body.city}`,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true, // Automatically parses the JSON string in the response
  })
  .then(function (body) {

    // get the coordinates from the body of the response
    let coordinate = body.results[0].locations[0].latLng;

    // assign coordinates to req.body (to the 'coordinates' property on the places schema)
    req.body.coordinates = {};
    req.body.coordinates.lat = String(coordinate.lat);
    req.body.coordinates.lng = String(coordinate.lng);

    // create a new place based on info from user input and geocoding info
    Place.create(req.body, (error, createdPlace) => {
      if (error) {
        console.log(error);
      } else {
        console.log('createdPlace=', createdPlace);
        res.redirect('/travel');
      }
    });

  })
  // catch errors
  .catch(function (err) {
      // Request failed due to technical reasons...
      console.log(err)
  });
});

// edit route
router.get('/travel/:id/edit', (req, res) => {
  Place.findById(req.params.id, (err, foundPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('foundPlace edit=', foundPlace);
      // res.redirect('/travel/' + req.params.id);
      res.render('edit.ejs', {
        place: foundPlace,
        currentUser: req.session.currentUser
      });
    }
  });
});

// update route (to edit places info)
router.put('/travel/:id', (req, res) => {
  console.log('update route', req.params);
  const url = "https://maps.googleapis.com/maps/api/js?key=" + process.env.GMAPS_API_KEY + "&callback=initMap"
  Place.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('updated place=',updatedPlace);
      res.redirect('/travel/' + req.params.id);
      // res.render('show.ejs', {
      //   place: updatedPlace,
      //   currentUser: req.session.currentUser,
      //   url: url,
      // });
    }
  });
});

// delete route (to remove a place from the destinations list)
router.delete('/travel/:id', (req, res) => {
  Place.findByIdAndDelete(req.params.id, (err, deletedPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('the deleted place=', deletedPlace);
      res.redirect('/travel');
    }
  });
});


module.exports = router;
