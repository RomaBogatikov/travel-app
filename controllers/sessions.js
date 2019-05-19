const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');
const Place = require('../models/places.js');
const bcrypt = require('bcrypt');

// index route (to display a log in form)
sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs', {
    currentUser: req.session.currentUser
  });
});


// post route (to log in existing user or to auto log in a new user)
sessions.post('/', (req, res) => {
  console.log('req.body=', req.body);
  User.findOne({username: req.body.username}, (err, foundUser) => {
    console.log('foundUser=', foundUser);
    if (err) {
      console.log(err);
    }
    // if the user with such a username was not found, send a 'wrong username or password' message
    if (!foundUser) {
      res.send('<a href="sessions/new">wrong username or password</a>')
    // else if user with specific username was found and password matches, log in
    } else if ( bcrypt.compareSync(req.body.password, foundUser.password) ) {
      req.session.currentUser = foundUser;
      res.redirect('/travel');
    // if password doesn't match send a 'wrong username or password' message
    } else {
      res.send('<a href="sessions/new">wrong username or password</a>')
    }
  });
});

// destroy route (to log user out)
sessions.delete('/delete', (req, res)=>{
  console.log('logout clicked');
  req.session.destroy(() => {
      res.redirect('/travel')
  })
})


// post route (to leave comments)
sessions.post('/comments', (req, res) => {
  console.log('received comment', req.body);
  // find a place and push user comment to 'comments' array (to display comments and username)
  Place.findByIdAndUpdate(req.body.place_id, {$push: {"comments": req.body.username + ": " + req.body.comment}}, {new: true}, (err, updatedPlace) => {
    if (err) {
      console.log(err);
    } else {
      console.log('updatedPlace=', updatedPlace);
    }
  });
  // find a user and add user comment to user 'comments' array (to display all comments of a specific user)
  User.findByIdAndUpdate(req.body.user_id, {$push: {"comments": req.body.comment}}, {new: true}, (err, updatedUser) => {
    if (err) {
      console.log(err);
    } else {
      console.log('updatedUser=', updatedUser);
    }
  });

})


module.exports = sessions
