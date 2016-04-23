var express = require('express');
var router = express.Router();
var passport = require('passport');

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

/* GET start splash page */
router.get('/', function(req, res, next) {
  if (req.isAuthenticated())
    res.redirect('/home');
  res.render('start');
});

/* GET home page. */

router.get('/home', isAuthenticated, function(req, res, next) {
  res.render('userhome', { username: req.user });
  //res.render('start');
});

/* GET account page. */
router.get('/account', function(req, res, next) {
  res.render('account', { username: 'User00' });
});

/* GET settings page. */
router.get('/settings', function(req, res, next) {
  res.render('settings', { username: 'User00' });
});

/* GET general login/sign-up page */
router.get('/gen_auth', function(req, res, next) {
  res.render('gen_auth', {message: req.flash('message')});
})

/* account POST requests */
/* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/gen_auth',
    failureFlash : true
  }));
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/',
    failureRedirect: '/gen_auth',
    failureFlash : true
  }));
  /* Handle Logout */
router.get('/signout', function(req, res) {
  req.logout();
  res.redirect('/');
});




module.exports = function(io, passport) {
  /* ~~~SOCKET.IO STUFF~~~ */
  io.on('connection', function(socket) {
    console.log('A user connected - index.js');
    socket.on('disconnect', function() {
      console.log('user disconnected - index.js');
    });
    socket.on('sign on', function(msg) {
      console.log(msg);
    });
  });
  return router;

  /* account POST requests */
  /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
      successRedirect: '/',
      failureRedirect: '/gen_auth',
      failureFlash : true
    }));
    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/',
      failureRedirect: '/gen_auth',
      failureFlash : true
    }));
}
