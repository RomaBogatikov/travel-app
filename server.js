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
const MONGODB_URI = process.env.MONGODB_URI;
// const MONGODB_URI = 'mongodb+srv://heroku_9wmm6l41:magistr16@cluster-9wmm6l41.s1zhc.mongodb.net/heroku_9wmm6l41'

// Connect to Mongo
mongoose.connect(MONGODB_URI , {useNewUrlParser: true, useUnifiedTopology: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

// open the connection to mongo
db.on('open' , ()=>{});

////////////
//Middleware
/////////////

// sessions controller
app.use(session({
  secret: process.env.SECRET,
  // secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings

// use method override (allow PUT and DELETE from a form)
app.use(methodOverride('_method'));

// use travelController
app.use(travelController);

// users controller
app.use('/travel/users/', usersController)

// use favoritesController
app.use('/travel/favorites', favoritesController);

// use sessionsController
app.use('/travel/sessions/', sessionsController);




////////////////
///Routes
////////////////
// RESTful routes are in controllers/travel.js
// need this route for heroku deployment
app.get('/', (req, res) => {
  res.redirect('/travel');
})

// seed route
app.get('/seed', (req, res) => {
  Place.create([
    {
      city: "Milford",
      country: "USA",
      imgURL: "https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/960015_10151597506669614_1784949868_n.jpg?_nc_cat=111&_nc_ht=scontent-lga3-1.xx&oh=3194d53c821e098449bf9461022e14d9&oe=5D77BDF9",
      coordinates: {
        lat: "41.222319",
        lng: "-73.056495"
      }
    },
    {
      city: "New Haven",
      country: "USA",
      imgURL: "https://cdn.passporthealthusa.com/wp-content/uploads/2018/06/new-haven-clinic-temp-photo.jpg?x71414",
      coordinates: {
        lat: "41.308214",
        lng: "-72.925052"
      }
    },
    {
      city: "New York",
      country: 'USA',
      imgURL: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      coordinates: {
        lat: "40.730646",
        lng: "-73.986614"
      }
    },
    {
      city: "Seattle",
      country: 'USA',
      imgURL: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?cs=srgb&dl=architecture-buildings-canada-374870.jpg&fm=jpg',
      coordinates: {
        lat: "47.603832",
        lng: "-122.330062"
      }
    },
    {
      city: "Chicago",
      country: 'USA',
      imgURL: 'https://images.pexels.com/photos/2124696/pexels-photo-2124696.jpeg?cs=srgb&dl=aerial-shot-architecture-bird-s-eye-view-2124696.jpg&fm=jpg',
      coordinates: {
        lat: "41.875555",
        lng: "-87.624421"
      }
    },
    {
      city: "Dubai",
      country: 'United Arab Emirates',
      imgURL: 'https://images.pexels.com/photos/2044434/pexels-photo-2044434.jpeg?cs=srgb&dl=architecture-beach-building-2044434.jpg&fm=jpg',
      coordinates: {
        lat: "25.07501",
        lng: "55.188761"
      }
    },
    {
      city: "Milan",
      country: 'Italy',
      imgURL: 'https://images.pexels.com/photos/409127/pexels-photo-409127.jpeg?cs=srgb&dl=architecture-blue-sky-buildings-409127.jpg&fm=jpg',
      coordinates: {
        lat: "45.466797",
        lng: "9.190498"
      }
    },
    {
      city: "Zurich",
      country: 'Switzerland',
      imgURL: 'https://images.pexels.com/photos/773471/pexels-photo-773471.jpeg?cs=srgb&dl=architecture-bahnhofstrasse-buildings-773471.jpg&fm=jpg',
      coordinates: {
        lat: "47.372396",
        lng: "8.542322"
      }
    },
    {
      city: "Singapore",
      country: 'Singapore',
      imgURL: 'https://images.pexels.com/photos/711193/pexels-photo-711193.jpeg?cs=srgb&dl=architecture-buildings-city-711193.jpg&fm=jpg',
      coordinates: {
        lat: "1.290475",
        lng: "103.852036"
      }
    },
    {
      city: "Kuala Lumpur",
      country: 'Malaysia',
      imgURL: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg?cs=srgb&dl=architecture-buildings-city-1538177.jpg&fm=jpg',
      coordinates: {
        lat: "3.154687",
        lng: "101.713636"
      }
    },
    {
      city: "Paris",
      country: 'France',
      imgURL: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?cs=srgb&dl=architecture-buildings-church-338515.jpg&fm=jpg',
      coordinates: {
        lat: "48.85661",
        lng: "2.351499"
      }
    },
    {
      city: "London",
      country: 'England',
      imgURL: 'https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?cs=srgb&dl=ancient-architecture-bridge-726484.jpg&fm=jpg',
      coordinates: {
        lat: "51.507322",
        lng: "-0.127647"
      }
    },
    {
      city: "Santorini",
      country: 'Greece',
      imgURL: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?cs=srgb&dl=ancient-architecture-building-1010657.jpg&fm=jpg',
      coordinates: {
        lat: "36.407111",
        lng: "25.456664"
      }
    }
  ], (err, data) => {
    res.redirect('/travel');
  });
});

// listen
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
