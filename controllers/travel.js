const express = require('express');
const router = express.Router();
// require Place model (collection 'places' in 'travel' database)
const Place = require('../models/places.js');

// // index route
// router.get('/travel/' , (req, res) => {
//   Place.find({}, (error, allPlaces) => {
//     res.render('index.ejs', {
//       places: allPlaces,
//       currentUser: req.session.currentUser
//     });
//   });
// });

// new route
router.get('/travel/new', (req, res) => {
  res.render('new.ejs');
});

// show route
router.get('/travel/:id', (req, res) => {
  // console.log('req.params.id=', req.params.id);
  Place.findById(req.params.id, (err, foundPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('foundplace show=', foundPlace);
      res.render('show.ejs', {
        place: foundPlace
      });
    }
  });
});

// post route
router.post('/travel', (req, res) => {
  Place.create(req.body, (error, createdPlace) => {
    res.redirect('/travel/');
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
        place: foundPlace
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
        place: updatedPlace
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
  })
})


module.exports = router;
