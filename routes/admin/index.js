const express = require('express');
const router = express.Router();

const productController = require('./product-controller');

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

router.all('/*', ensureLoggedIn, function (req, res, next) {
    if(req.user.role) {
        next();
    } else {
        res.redirect(401, '/auth/login');
    }
});

router.get('/', function (req, res, next) {
    res.render('admin/home/index', { title: 'Admin' });
});

router.get('/products', productController.getProducts);

router.get('/products/:id/*', productController.getProductsById);

router.get('/orders', function (req, res, next) {
    res.render('admin/orders/index', { title: 'Admin' });
});

router.get('/orders/:id/*', function (req, res, next) {
    res.render('admin/orders/edit-orders', { title: 'Admin' });
});

router.get('/statistics', function (req, res, next) {
    res.render('admin/statistics/index', { title: 'Admin' });
});

module.exports = router;