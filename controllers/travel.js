const express = require('express');
const router = express.Router();
// require Place model (collection 'places' in 'travel' database)
const Place = require('../models/places.js');
const session = require('express-session');
const rp = require('request-promise');

require('dotenv').config();

router.use(session({
  secret: process.env.SECRET,
  // secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

// // index route
// router.get('/travel/' , (req, res) => {
//   Place.find({}, (error, allPlaces) => {
//     res.render('index.ejs', {
//       places: allPlaces,
//       currentUser: req.session.currentUser
//     });
//   });
// });


// index route
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

// new route
router.get('/travel/new', (req, res) => {
  if (req.session.currentUser) {
    res.render('new.ejs', {
      currentUser: req.session.currentUser
    });
  } else {
    res.redirect('/travel/sessions/new');
  }
});

// show route
router.get('/travel/:id', (req, res) => {
  // console.log('req.params.id=', req.params.id);
  console.log('show route');
  console.log('req.session.currentUser=', req.session.currentUser);
  Place.findById(req.params.id, (err, foundPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('foundplace show=', foundPlace);
      res.render('show.ejs', {
        place: foundPlace,
        currentUser: req.session.currentUser,
        keygoogle: process.env.GMAPS_API_KEY
      });
    }
  });
});

// post route (create)
router.post('/travel', (req, res) => {
  // try{
    // KEYGOOGLE = 'AIzaSyBt9kqAILeZXEdz846f3Yn3oJG84j4SkH8';
    const KEYGOOGLE = process.env.GMAPS_API_KEY;
    console.log('create post route');
    console.log('req.body=', req.body);
    // var KEY='lZkaliDxvBgp9v4kmuW5qDMEqPeZICMZ';
    const KEY = process.env.MAPQUEST_API_KEY;
    var options = {
      uri: `http://open.mapquestapi.com/geocoding/v1/address?key=${KEY}&location=${req.body.city}`,
      headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true, // Automatically parses the JSON string in the response
    // resolveWithFullResponse: true
  };

  var coordinates = rp(options)
      .then(function (body) {
          // Request succeeded but might as well be a 404
          // Usually combined with resolveWithFullResponse = true to check response.statusCode
          console.log('body=', body.results[0].locations[0].latLng);
          let coordinates = body.results[0].locations[0].latLng;
          // return coordinates

    // console.log('result=', JSON.stringify(coordinates));
    req.body.coordinates = {};
    req.body.coordinates.lat = String(coordinates.lat);
    req.body.coordinates.lng = String(coordinates.lng);
    console.log('req.body=', req.body);
    Place.create(req.body, (error, createdPlace) => {
      if (error) {
        console.log(error);
      } else {
        console.log('createdPlace=', createdPlace);
        res.redirect('/travel');
      }
    });





      })
      .catch(function (err) {
          // Request failed due to technical reasons...
      });


  // } catch (error) {
  //   console.log(error)
  // }





});

// edit route
router.get('/travel/:id/edit', (req, res) => {
  Place.findById(req.params.id, (err, foundPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('foundPlace edit=', foundPlace);
      res.render('edit.ejs', {
        place: foundPlace,
        currentUser: req.session.currentUser
      });
    }
  });
});

// update route
router.put('/travel/:id', (req, res) => {
  console.log('update route', req.params);
  Place.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('updated place=',updatedPlace)
      res.render('show.ejs', {
        place: updatedPlace,
        currentUser: req.session.currentUser
      });
    }
  });
});

// delete route
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
