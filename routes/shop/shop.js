var express = require('express');
var router = express.Router();
var controller = require('./controller.js');

/* GET about page. */
router.get('/', controller.showList);

router.get('/query', controller.queryList);

router.get('/:id', controller.showProduct);

router.post('/:id/review', controller.addReview);

router.get('/:id/review', controller.showReview);

// router.post('/:id/cart', controller.addToCart);

module.exports = router;
