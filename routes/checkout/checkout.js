var express = require('express');
var router = express.Router();

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

/* GET about page. */
router.get('/', ensureLoggedIn, function(req, res, next) {
  res.render('checkout/checkout', { title: req.user.username, user: req.user });
});

module.exports = router;