const db = require("../../models/index.js");

exports.addToCart = async (req, res, next) => {
    if (!req.params.id) {
        res.redirect('/shop');
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        res.redirect('/shop');
    }
    let cart = await db.Cart.findOne({ where: { product_id: id } });
    if (cart) {
        cart.quantity += 1;
        cart.save();
    } else {
        db.Cart.create({
            product_id: id,
            quantity: 1
        });
    }
    res.json({ success: true, message: "Added to cart" });
}

exports.getCart = async (req, res, next) => {
    let cart = await db.Cart.findAll();
    let products = [];
    for (let i = 0; i < cart.length; i++) {
        let product = await db.Product.findOne({ where: { id: cart[i].product_id } });
        products.push(product);
    }
    res.render('shop/cart', { products: products });
}

exports.deleteCart = async (req, res, next) => {
    if (!req.params.id) {
        res.redirect('/cart');
    }
    let id = req.params.id;
    let cart = await db.Cart.findOne({ where: { product_id: id } });
    if (cart) {
        cart.destroy();
    }
    res.redirect('/cart');
}