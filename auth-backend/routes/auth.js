var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');
const moment = require('moment');

/* Login a user. */
router.post('/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(404).send(info);
    }
    console.log('PRE: ', user);
    req.logIn(user, (err) => {
      console.log('User: ', user);
      let userObject = { _id: user._id, email: user.email };
      if (err) {
        return res.status(404).send(err); 
      }
      else {
        var token = jwt.sign({
          user: userObject
        }, 'testSIGNATURE123', {
          expiresIn: '2h'
        });
        return res.json({
          token: token,
          id: user._id,
          email: user.email
        });
      }
    });
  })(req, res, next);
});

/**
 * POST /register
 * Create a new local account.
 */
router.post('/register', function(req, res, next) {
  console.log("HELLLLOOOOOOO", req.body);
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

  const errors = req.validationErrors();

  console.log('errors: ', errors);
  if (errors) {
    return res.status(400).send({ errors })
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    lastLogin: moment()
  });
  console.log('USER: ', user);
  User.findOne({ email: req.body.email }, {password: 0}, (err, existingUser) => {
    if (err) { return next(err); }
    if (existingUser) {
      return res.status(400).send({ error: 'Account with that email address already exists.' });
    }
    console.log('SAVING: ', user);
    user.save((err) => {
      if (err) { return next(err); }
      req.logIn(user, (err) => {
        if (err) {
          return res.status(400).send({ error: 'Account with that email address already exists.' });
        }
        else {
          var token = jwt.sign({user: user.toObject()}, 'testSIGNATURE123', { expiresIn: '2h' });
          var now = new Date();
          now.setHours(now.getHours() + 24);
          res.json({
            token: token,
            id: user._id,
            email: user.email
          });
        }
      });
    });
  });
});

module.exports = router;