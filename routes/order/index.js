const express = require('express');
const router = express.Router();

const db = require('../../models');

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

router.post('/', ensureLoggedIn, async function (req, res, next) {
    if(!req.body.items) {
        return res.json({});
    }
    const order = await db.Order.create({
        user_id: req.user.id,
        status: 'pending',
    });
    const cart = await db.Cart.findOne({
        where: {
            user_id: req.user.id,
        },
        include: [
            {
                model: db.CartItem,
                // include: [
                //     {
                //         model: db.Product,
                //     },
                // ],
            },
        ],
    });
    // console.log(cart);
    if(!cart || !cart.CartItems || cart.CartItems.length === 0) {
        return res.json(order);
    }
    console.log(req.body.items);
    cart.CartItems.forEach(async (cartItem) => {
        console.log(cartItem.id);
        console.log(req.body.items.includes(cartItem.product_id.toString()));
        if(req.body.items.includes(cartItem.product_id.toString())) {
            await db.OrderItem.create({
                order_id: order.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
            }).then(async (orderItem) => {
                await cartItem.destroy();
            });
        }
    });
    return res.json(order);
});

router.get('/', ensureLoggedIn, async function (req, res, next) {
    const orders = await db.Order.findAll({
        where: {
            user_id: req.user.id,
        },
        include: [
            {
                model: db.OrderItem,
                include: [
                    {
                        model: db.Product,
                    },
                ],
            },
        ],
    });
    return res.render('order/index', { orders });
    // return res.json(orders);
});

router.get('/:id', ensureLoggedIn, async function (req, res, next) {
    const order = await db.Order.findOne({
        where: {
            id: req.params.id,
        },
        include: [
            {
                model: db.OrderItem,
                include: [
                    {
                        model: db.Product,
                    },
                ],
            },
        ],
    });
    return res.json(order);
});

router.patch('/:id', ensureLoggedIn, async function (req, res, next) {
    const order = await db.Order.update(
        {
            status: req.body.status,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    );
    return res.json(order);
});

module.exports = router;