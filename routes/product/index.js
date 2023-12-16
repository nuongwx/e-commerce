const express = require('express');
const router = express.Router();

const controller = require('./controller.js');

router.get('/:id', controller.showProduct);

router.get('/:id/reviews', controller.showReviews);

router.post('/:id/reviews', controller.createReview);

module.exports = router;