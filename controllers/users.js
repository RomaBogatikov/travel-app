const express = require('express');
const user = express.Router();
const User = require('../models/users.js');
const session = require('express-session');
const bcrypt = require('bcrypt');

require('dotenv').config();

user.use(session({
  secret: process.env.SECRET,
  // secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// index route (to display a form to create a new user)
user.get('/new/', (req, res) => {
  // console.log('I am inside new');
  res.render('users/new.ejs', {
    currentUser: req.session.currentUser
  })
});

// post route (to create a new user)
user.post('/', async (req, res) => {
  console.log('req.body=', req.body);

  try {
    // find all users with the same username and password and with the same username
    // with Promise.all all the requests execute at the same time (thus taking less time to execute). Async ... await with multiple awaits resolves sequentially (one after another)
    // const foundUsers = await Promise.all([User.find({username: req.body.username, password: req.body.password}), User.find({username: req.body.username})]);
    const foundUsers = await User.find({username: req.body.username});
    console.log('data=', foundUsers);
    // console.log('req.body.password=', req.body.password);
    // console.log('foundUsers[1].password=', foundUsers[0].password);
    // if (bcrypt.compareSync(req.body.password, foundUsers[0].password)) {
    //   console.log('YOU EXIST');
    // };
    // check if the user already exists
    // if there already exists a user with the same username and password
    if (foundUsers.length > 0 && bcrypt.compareSync(req.body.password, foundUsers[0].password)) {
      // notify the user about it
      console.log('You signed up before. Go to Log In.');
      res.send('<a href="/travel">You signed up before. Go to Log In</a>')
      // redirect the user to login page

    // if there is a user with the same username
    } else if (foundUsers.length > 0) {
      // notify the user and ask to pick a different username and redirect back to the 'create user' form
      console.log('User with such a username already exists.');
      // remove res.send below when the alert page is ready
      res.send("<a href='/travel/users/new'>User with such a username already exists. Pick a different username.</a>");
      res.redirect('/travel/users/new');
    } else {    // the user is new, create it
      // overwrite the user password with the hashed password, then pass that in to database
      req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
      User.create(req.body, (err, createdUser) => {
        if (err) {
          console.log(err);
        } else {
          console.log('createdUser=', createdUser);
          // tried to implement automatic login after new user signs up
          req.session.currentUser = createdUser;
          console.log('req.session', req.session);
          console.log('req.session.currentuser', req.session.currentUser);
          res.redirect('/travel/');

        }
      });
    }
  } catch (error) {
    console.log('error inside catch=', error);
  }
  console.log('who is first?');

});



module.exports = user;
