const db = require('../../models/index.js');

exports.showCart = async (req, res, next) => {
    let query = {};
    if (!req.user) {
        query.session_id = req.session.id;
    } else {
        query.user_id = req.user.id;
    }
    let cart = await db.Cart.findOne({ where: query });
    if (!cart) {
        return res.json([]);
    }
    cart = await db.Cart.findOne({ where: query, include: { model: db.CartItem, include: { model: db.Product } } });
    return res.json(cart);
}

exports.updateItem = async (req, res, next) => {
    let query = {};
    if (!req.user) {
        query.session_id = req.session.id;
    } else {
        query.user_id = req.user.id;
    }
    let cart = await db.Cart.findOne({ where: query });
    if (!cart) {
        cart = await db.Cart.create(query);
    }
    let product = await db.CartItem.findOne({ where: { cart_id: cart.id, product_id: req.body.productId } });
    let quantity = parseInt(req.body.quantity);
    if (product) {
        if (quantity < 1) {
            product.destroy();
        } else {
            product.quantity = quantity;
        }
        product.save().then(async () => {
            return res.json(await db.Cart.findOne({ where: query, include: { model: db.CartItem, include: { model: db.Product } } }));
        });
    }
    else {
        await db.CartItem.create({ cart_id: cart.id, product_id: req.body.productId, quantity: quantity }).then(async () => {
            return res.json(await db.Cart.findOne({ where: query, include: { model: db.CartItem, include: { model: db.Product } } }));
        });
    }
    // return res.json(await db.Cart.findOne({ where: query, include: { model: db.CartItem, include: { model: db.Product } } }));
}

// exports.addToCart = async (req, res, next) => {
//     let query = {};
//     if (!req.user) {
//         query.session_id = req.session.id;
//     } else {
//         query.user_id = req.user.id;
//     }
//     let quantity = parseInt(req.body.quantity);
//     let cart = await db.Cart.findOne({ where: query });
//     if (!cart) {
//         cart = await db.Cart.create(query);
//     }
//     let current_item = await db.CartItem.findOne({ where: { cart_id: cart.id, product_id: req.params.id } });
//     if (current_item) {
//         current_item.quantity += quantity;
//         current_item.save();
//     }
//     else {
//         await db.CartItem.create({ cart_id: cart.id, product_id: req.params.id, quantity: quantity });
//     }
//     return res.json(await db.Cart.findAll({ where: query, include: { model: db.CartItem, include: { model: db.Product } } }));
// }