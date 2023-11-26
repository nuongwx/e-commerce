const db = require("../../models/index.js");

exports.showList = async (req, res, next) => {
    db.products.findAll().then(products => {
        res.render('shop/shop', { products: products });
    }).catch(err => {
        console.log(err);
    });
}

exports.showProduct = async (req, res, next) => {
    if (!req.params.id) {
        res.redirect('/shop');
    }
    let id = req.params.id;
    let product = await db.products.findOne({ where: { id: id } });
    if (!product) {
        res.redirect('/shop');
    }
    res.render('shop/product', { product: product });
    // db.products.findByPk(req.params.id).then(product => {
    //     res.render('shop/product', { product: product });
    // }).catch(err => {
    //     console.log(err);
    // });
}