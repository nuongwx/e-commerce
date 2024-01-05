const express = require('express');
const router = express.Router();
const authController = require('./controller');
const passport = require('../../middleware/passport'); // sike

const db = require('../../models/index.js');

/* GET home page. */
router.get('/login', authController.getLogin);

// router.post('/login', authController.postLogin);

// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/auth/login',
//     failureMessage: 'Invalid email or password',
// }));

router.post('/login', function (req, res, next) {
    let query = {};
    query.session_id = req.session.id;
    passport.authenticate('local', function (err, user, info) {
        console.log('user', user);
        // if (err) { return next(err); }
        if (err) { console.log(err); return res.render('auth/index', { title: 'Login', layout: 'auth/layout', message: err.error, login: true }); }
        if (!user) { return res.render('auth/index', { title: 'Login', layout: 'auth/layout', message: "Invalid email or password", login: true }); }
        db.Cart.findOne({ where: query }).then(async function (session_cart) {
            let user_cart = await db.Cart.findOne({ where: { user_id: user.id } });
            if (!session_cart && !user_cart) {
                let new_cart = await db.Cart.create({ user_id: user.id });
            }
            else if (session_cart && !user_cart) {
                session_cart.user_id = user.id;
                await session_cart.save();
            }
            else if(session_cart && user_cart) {
                let session_cart_items = await db.CartItem.findAll({ where: { cart_id: session_cart.id } });
                for (let i = 0; i < session_cart_items.length; i++) {
                    let session_cart_item = session_cart_items[i];
                    let user_cart_item = await db.CartItem.findOne({ where: { cart_id: user_cart.id, product_id: session_cart_item.product_id } });
                    if (user_cart_item) {
                        user_cart_item.quantity += session_cart_item.quantity;
                        await user_cart_item.save();
                    }
                    else {
                        session_cart_item.cart_id = user_cart.id;
                        await session_cart_item.save();
                    }
                }
                await session_cart.destroy();
            }
            req.logIn(user, function (err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        });
    })(req, res, next);
});


router.get('/logout', authController.logout);

router.post('/logout', authController.logout);

router.get('/register', authController.getRegister);

router.post('/register', authController.register);

router.get('/verify-email', authController.verifyEmail);

router.post('/forgot', authController.forgotPassword);

router.get('/forgot', function (req, res, next) {
    res.render('auth/index', { title: 'Forgot Password', layout: 'auth/layout', forgot: true });
});

router.get('/reset-password', function (req, res, next) {
    res.render('auth/index', { title: 'Reset Password', layout: 'auth/layout', reset: true });
});

router.post('/reset-password', authController.resetPassword);

module.exports = router;
