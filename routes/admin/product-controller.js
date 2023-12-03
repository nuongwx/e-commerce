const db = require('../../models');

exports.getProducts = function (req, res, next) {
    db.Product.findAll({include: [db.Category]}).then(function (products) {
        res.render('admin/products/index', { title: 'Admin', products: products });
    });
};

exports.getProductsById = function (req, res, next) {
    let category = db.Category.findAll().then(function (categories) {
    db.Product.findByPk(req.params.id).then(function (product) {
        res.render('admin/products/edit-products', { title: 'Admin', product: product , categories: categories});
    });
    });
};