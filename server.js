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

// use method override (allow PUT and DELETE from a form)
app.use(methodOverride('_method'));

// use travelController
app.use(travelController);


////////////////
///Routes
////////////////


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
