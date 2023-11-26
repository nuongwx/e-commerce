var express = require('express');
const { json } = require('sequelize');
var router = express.Router();

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

/* GET about page. */
router.get('/profile', ensureLoggedIn, function(req, res, next) {
  res.render('user/profile', { user: req.user, debug: JSON.stringify(req.user, null, 4) });
});

module.exports = router;