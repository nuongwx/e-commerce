var express = require('express');
var router = express.Router();

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('shop/shop', { title: 'Products' });
});

router.get('/:id', function(req, res, next) {
    res.render('shop/product', { title: 'Product' });
});

module.exports = router;
