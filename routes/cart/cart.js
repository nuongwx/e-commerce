const express = require('express');
const router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('cart/cart', { title: 'Cart' });
});

module.exports = router;
