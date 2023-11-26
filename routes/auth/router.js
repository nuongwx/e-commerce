const express = require('express');
// const router = express.Router();
const authController = require('./controller');

var router = express.Router();

/* GET home page. */
router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

router.post('/logout', authController.logout);

router.get('/register', authController.getRegister);

router.post('/register', authController.register);

module.exports = router;
