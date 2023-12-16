var express = require('express');
var router = express.Router();

const db = require('../../models');

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

/* GET about page. */
router.get('/', ensureLoggedIn, async function (req, res, next) {
    const cart = await db.Cart.findOne({
        where: {
            user_id: req.user.id,
        },
        include: [
            {
                model: db.CartItem,
                include: [
                    {
                        model: db.Product,
                    },
                ],
            },
        ],
    }).then(cart => {
        if(!cart || !cart.CartItems || cart.CartItems.length === 0)
        {
            return res.redirect('/cart');
        }
        return res.render('checkout/checkout', { title: 'Checkout', cart: cart });
    });
});

module.exports = router;