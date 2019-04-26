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
  console.log('req.body=', req.body);

  try {
    // find all users with the same username and password and with the same username
    // with Promise.all all the requests execute at the same time (thus taking less time to execute). Async ... await with multiple awaits resolves sequentially (one after another)
    const foundUsers = await Promise.all([User.find({username: req.body.username, password: req.body.password}), User.find({username: req.body.username})]);
    console.log('data=', foundUsers);

    // check if the user already exists
    // if there already exists a user with the same username and password
    if (foundUsers[0].length > 0) {
      // notify the user about it
      console.log('You signed up before. Go to Log In.');
      // redirect the user to login page

    // if there is a user with the same username
    } else if (foundUsers[1].length > 0) {
      // notify the user and ask to pick a different username and redirect back to the 'create user' form
      console.log('User with such a username already exists.');
      res.redirect('/travel/users/new');
    } else {    // the user is new, create it
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
