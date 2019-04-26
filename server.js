// dependencies
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
const Place = require('./models/places.js');

// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'+ `travel`;

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});

////////////
//Middleware
/////////////

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


////////////////
///Routes
////////////////

// index route
app.get('/travel/' , (req, res) => {
  Place.find({}, (error, allPlaces) => {
    res.render('index.ejs', {
      places: allPlaces
    });
  });
});

// new route
app.get('/travel/new', (req, res) => {
  res.render('new.ejs');
});

// show route
app.get('/travel/:id', (req, res) => {
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
app.post('/travel', (req, res) => {
  Place.create(req.body, (error, createdPlace) => {
    res.redirect('/travel/');
  });
});

// edit route
app.get('/travel/:id/edit', (req, res) => {
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
app.put('/travel/:id', (req, res) => {
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
app.delete('/travel/:id', (req, res) => {
  Place.findByIdAndDelete(req.params.id, (err, deletedPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('the deleted place=', deletedPlace);
      res.redirect('/travel/');
    }
  })
})


// seed route
app.get('/travel/seed', (req, res) => {
  Place.create([
    {
      city: "Milford",
      country: "USA",
      imgURL: "https://www.ci.milford.ct.us/sites/milfordct/files/imce/businesses_1.png",
      comments: ['nice shore town']
    },
    {
      city: "New Haven",
      country: "USA",
      imgURL: "",
      comments: ['home of Yale']
    }
  ], (err, data) => {
    res.redirect('/travel/');
  });
});

// listen
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
