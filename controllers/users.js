const express = require('express');
const user = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');
require('dotenv').config();

// index route (to display a form to create a new user)
user.get('/new/', (req, res) => {
  // console.log('I am inside new');
  res.render('users/new.ejs', {
    currentUser: req.session.currentUser
  })
});

// post route (to create a new user)
user.post('/', async (req, res) => {

  try {
    // find all users with provided username
    const foundUsers = await User.find({username: req.body.username});
    // if there already exists a user with the same username and password
    if (foundUsers.length > 0 && bcrypt.compareSync(req.body.password, foundUsers[0].password)) {
      // notify the user about it
      res.send('<a href="/travel">You signed up before. Go to Log In</a>')

    // if there is a user with the same username
    } else if (foundUsers.length > 0) {
      // notify the user and ask to pick a different username and redirect back to the 'create user' form
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
          // automatic login after new user signs up
          req.session.currentUser = createdUser;
          res.redirect('/travel/');
        }
      });
    }
  } catch (error) {
    console.log('error inside catch=', error);
  }
});



module.exports = user;
