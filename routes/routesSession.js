const express = require('express');
const passport = require('passport')
const jwt = require('jsonwebtoken');
const pool = require('../libs/Conection');

const route = express.Router();

route.post('/signup', passport.authenticate('signup', { session: false }), async (req, res, next) => {
  res.json({
    message: 'Signup successful',
    user: req.user,
  })
})

route.post('/login', async (req, res, next) => {
  console.log(req.params);
  console.log('1');
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        console.log(err)
        const error = new Error('new Error')
        return next(error)
      }

      req.login(user, { session: false }, async (err) => {
        if (err) return next(err)
        const body = { admin_id: user.admin_id, username: user.username }
        const token = jwt.sign({ user: body }, 'top_secret')
        return res.json({ token, user })
      })
    }
    catch (e) {
      return next(e)
    }
  })(req, res, next)
})

module.exports = route;
