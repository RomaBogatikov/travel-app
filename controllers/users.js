const express = require('express');
const user = express.Router();
const User = require('../models/users.js');
const session = require('express-session');

// new route (to display a form to create a new user)

user.get('/new/', (req, res) => {
  // console.log('I am inside new');
  res.render('users/new.ejs')
});

user.post('/', async (req, res) => {
  console.log('user post route');
  console.log('req.body=', req.body);

  try {
    const foundUser = await User.find();
    // console.log('founduser=', foundUser);
    // console.log('foundUser.username=', foundUser[0].username);
    // console.log('req.body.username=', req.body.username);

    // check if the user already exists
    // if there is already a user with the same username and password
    if (foundUser[0].username === req.body.username && foundUser[0].password === req.body.password) {
      // notify the user about it
      console.log('You signed up before. Go to Log In.');
      // redirect the user to login page
    // if there is a user with the same username
    } else if (foundUser[0].username === req.body.username) {
      // notify the user and ask to pick a different username and redirect back to the 'create user' form
      console.log('User with such a username already exists.');
      res.redirect('/travel/users/new');
    // else create a new user
    } else {
      User.create(req.body, (err, createdUser) => {
        if (err) {
          console.log(err);
        } else {
          console.log('createdUser=', createdUser);
          res.redirect('/travel/');
        }
      });
    }
  } catch (error) {
    console.log('error inside catch=', error);
  }

});

module.exports = user;
