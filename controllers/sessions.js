const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');
const Place = require('../models/places.js');
const bcrypt = require('bcrypt');

// index route
sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs', {
    currentUser: req.session.currentUser
  });
});


// post route (to log in)
sessions.post('/', (req, res) => {
  console.log('req.body=', req.body);
  User.findOne({username: req.body.username}, (err, foundUser) => {
    console.log('foundUser=', foundUser);
    if (err) {
      console.log(err);
    }

    if (!foundUser) {
      res.send('<a href="sessions/new/">wrong username or password</a>')
    } else if ( bcrypt.compareSync(req.body.password, foundUser.password) ) {
      req.session.currentUser = foundUser;
      // console.log('req.app.=', req.app.locals);
      res.redirect('/travel');
    } else {
      res.send('<a href="sessions/new/">wrong username or password</a>')
    }
  });
});

// destroy route (to log out)
sessions.delete('/delete', (req, res)=>{
  console.log('logout clicked');
  req.session.destroy(() => {
      res.redirect('/travel')
  })
})


// post route (to leave comments)
sessions.post('/comments', (req, res) => {
  console.log('received comment', req.body);
  // try {
    // let place = await Place.findById(req.body.place_id);
    // let user = await User.findById(req.body.user_id);
    // console.log('place=', place);
    // console.log('user=', user);
    // let place_comments = place.comments.concat(req.body.username + ": " + req.body.comment);
    // let user_comments = user.comments.concat(req.body.comment);
    // console.log('place_comments=', place_comments);
    // console.log('user_comments=', user_comments);
    // Place.findByIdAndUpdate(req.body.place_id, {comments: place_comments}, {new: true}, (err, updatedPlace) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('updatedPlace=', updatedPlace);
    //   }
    // });
    // User.findByIdAndUpdate(req.body.user_id, {comments: user_comments}, {new: true}, (err, updatedUser) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('updatedUser=', updatedUser);
    //   }
    // });
    // req.session.currentUser.comments.concat(req.body.comment);
    // res.redirect('/travel/' + req.body.place_id);
    Place.findByIdAndUpdate(req.body.place_id, {$push: {"comments": req.body.username + ": " + req.body.comment}}, {new: true}, (err, updatedPlace) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updatedPlace=', updatedPlace);
      }
    });
    User.findByIdAndUpdate(req.body.user_id, {$push: {"comments": req.body.comment}}, {new: true}, (err, updatedUser) => {
      if (err) {
        console.log(err);
      } else {
        console.log('updatedUser=', updatedUser);
      }
    });
    // res.redirect('/travel/' + req.body.place_id);
  // } catch (error) {
  //   console.log(error);
  // }

})


module.exports = sessions
