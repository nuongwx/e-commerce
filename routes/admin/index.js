const express = require('express');
const router = express.Router();

const productRouter = require('./products/index');
const orderRouter = require('./orders/index');
const userRouter = require('./users/index');
const profileRouter = require('./profile/index');

const db = require('../../models');


var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

router.all('/*', ensureLoggedIn, function (req, res, next) {
    if (req.user.role) {
        db.User.findByPk(req.user.id).then(user => {
            res.locals.user = user;
            next();
        });
    } else {
        res.redirect(401, '/auth/login');
    }
});

router.get('/', function (req, res, next) {
    res.render('admin/home/index', { title: 'Admin' });
});

router.use('/product', productRouter);

router.use('/orders', orderRouter);

router.use('/users', userRouter);

router.use('/profile', profileRouter);

// router.get('/orders', function (req, res, next) {
//     res.render('admin/orders/index', { title: 'Admin' });
// });

// router.get('/orders/:id/*', function (req, res, next) {
//     res.render('admin/orders/edit-orders', { title: 'Admin' });
// });

router.get('/statistics', function (req, res, next) {
    res.render('admin/statistics/index', { title: 'Admin' });
});

module.exports = router;