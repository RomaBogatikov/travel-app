const express = require('express');
const router = express.Router();
// require Place model (collection 'places' in 'travel' database)
const Place = require('../models/places.js');
const session = require('express-session');

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
        currentUser: req.session.currentUser
      });
    }
  });
});

// post route (create)
router.post('/travel', (req, res) => {
  console.log('create post route')
  Place.create(req.body, (error, createdPlace) => {
    if (error) {
      console.log(error);
    } else {
      console.log('createdPlace=', createdPlace);
      res.redirect('/travel');
    }
  });

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
