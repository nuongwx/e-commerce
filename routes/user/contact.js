var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('user/contact', { title: 'Contacts' });
});

module.exports = router;
