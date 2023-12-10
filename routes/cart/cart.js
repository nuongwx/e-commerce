const express = require('express');
const router = express.Router();

const controller = require('./controller.js');

/* GET about page. */
router.get('/', function(req, res, next) {
  res.render('cart/cart', { title: 'Cart' });
});

router.get('/show', controller.showCart);

// router.delete('/:id', controller.deleteItem);

// router.patch('/:id', controller.updateItem);

router.post('/update', controller.updateItem);



module.exports = router;
