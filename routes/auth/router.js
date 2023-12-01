const express = require('express');
const router = express.Router();
const authController = require('./controller');
const passport = require('../../middleware/passport'); // sike



/* GET home page. */
router.get('/login', authController.getLogin);

// router.post('/login', authController.postLogin);

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/profile',
    failureRedirect: '/auth/login',
    failureMessage: 'Invalid email or password',
}));

router.get('/logout', authController.logout);

router.post('/logout', authController.logout);

router.get('/register', authController.getRegister);

router.post('/register', authController.register);

module.exports = router;
