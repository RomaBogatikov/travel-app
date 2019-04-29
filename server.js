// dependencies
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
// require controller (for 7 routes)
const travelController = require('./controllers/travel.js')
// require session for authentication
const session = require('express-session');
// require sessions controller
const sessionsController = require('./controllers/sessions.js');
// require users controller
const usersController = require('./controllers/users.js');
// require favorites controller
const favoritesController = require('./controllers/favorites.js');
// need to require place for index route (unless I find out how to move index route back to controllers/travel.js)
const Place = require('./models/places.js');

// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

// require dotenv
require('dotenv').config();

// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/'+ 'travel';

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

// use method override (allow PUT and DELETE from a form)
app.use(methodOverride('_method'));

// users controller
app.use('/travel/users/', usersController)

// use travelController
app.use(travelController);

// use favoritesController
app.use('/travel/favorites', favoritesController);

// sessions controller
app.use(session({
  secret: process.env.SECRET,
  // secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use('/travel/sessions/', sessionsController);




////////////////
///Routes
////////////////
// RESTful routes are in controllers/travel.js
// need this route for heroku deployment
app.get('/', (req, res) => {
  // res.send('<a href="/travel/">Test</a>');
  res.redirect('/travel');
})

app.get('/travel' , (req, res) => {
  Place.find({}, (error, allPlaces) => {
    console.log('currentUser = ', req.session.currentUser);
    res.render('index.ejs', {
      places: allPlaces,
      currentUser: req.session.currentUser
    });
  });
});

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
    },
    {
      city: "New York",
      country: 'USA',
      imgURL: 'https://www.pexels.com/photo/aerial-architecture-blue-sky-buildings-466685/'
    },
    {
      city: "Seattle",
      country: 'USA',
      imgURL: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?cs=srgb&dl=architecture-buildings-canada-374870.jpg&fm=jpg'
    },
    {
      city: "Chicago",
      country: 'USA',
      imgURL: 'https://images.pexels.com/photos/2124696/pexels-photo-2124696.jpeg?cs=srgb&dl=aerial-shot-architecture-bird-s-eye-view-2124696.jpg&fm=jpg'
    },
    {
      city: "Dubai",
      country: 'United Arab Emirates',
      imgURL: 'https://images.pexels.com/photos/2124696/pexels-photo-2124696.jpeg?cs=srgb&dl=aerial-shot-architecture-bird-s-eye-view-2124696.jpg&fm=jpg'
    },
    {
      city: "Milan",
      country: 'Italy',
      imgURL: 'https://images.pexels.com/photos/409127/pexels-photo-409127.jpeg?cs=srgb&dl=architecture-blue-sky-buildings-409127.jpg&fm=jpg'
    },
    {
      city: "Zurich",
      country: 'Switzerland',
      imgURL: 'https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg?cs=srgb&dl=architecture-bahnhofstrasse-buildings-773471.jpg&fm=jpg'
    },
    {
      city: "Singapore",
      country: 'Singapore',
      imgURL: 'https://images.pexels.com/photos/711193/pexels-photo-711193.jpeg?cs=srgb&dl=architecture-buildings-city-711193.jpg&fm=jpg'
    },
    {
      city: "Kuala Lumpur",
      country: 'Malaysia',
      imgURL: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?cs=srgb&dl=architecture-buildings-city-1538177.jpg&fm=jpg'
    },
    {
      city: "Paris",
      country: 'France',
      imgURL: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?cs=srgb&dl=architecture-art-blue-699466.jpg&fm=jpg'
    },
    {
      city: "London",
      country: 'England',
      imgURL: 'https://www.pexels.com/photo/big-ben-bridge-castle-city-460672/'
    },
    {
      city: "Santorini",
      country: 'Greece',
      imgURL: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?cs=srgb&dl=ancient-architecture-building-1010657.jpg&fm=jpg'
    }
  ], (err, data) => {
    res.redirect('/travel');
  });
});

// listen
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
