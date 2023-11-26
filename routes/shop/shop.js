var express = require('express');
var router = express.Router();
var controller = require('./controller.js');

/* GET about page. */
router.get('/', controller.showList);

router.get('/:id', controller.showProduct);
module.exports = router;
