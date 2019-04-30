const express = require('express');
const sessions = express.Router();
const User = require('../models/users.js');
const bcrypt = require('bcrypt');

// index route
sessions.get('/new', (req, res) => {
  res.render('sessions/new.ejs');
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


module.exports = sessions
