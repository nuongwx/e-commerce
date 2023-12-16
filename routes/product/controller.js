const db = require('../../models');

exports.showProduct = async (req, res, next) => {
    if (!req.params.id) {
        return res.redirect('/shop');
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.redirect('/shop');
    }
    let reviews = await db.Review.findAll({ where: { product_id: id }, include: { model: db.User } });

    // random product from different category
    let randomProduct = await db.Product.findOne({ where: { category_id: { [db.Sequelize.Op.ne]: product.category_id } }, order: db.sequelize.random() });
    // select 3 random products from same category
    let relatedProducts = await db.Product.findAll({ where: { category_id: product.category_id, id: { [db.Sequelize.Op.ne]: product.id } }, order: db.sequelize.random(), limit: 2 }).then(async (products) => {
        products.push(randomProduct);
        return products;
    });

    return res.render('shop/product', { product: product, reviews: reviews, related_products: relatedProducts });
}

exports.createReview = async (req, res, next) => {
    if (!req.user.id || !req.params.id) {
        return res.redirect('/shop');
    }
    let product_id = req.params.id;
    let user_id = req.user.id;
    let rating = req.body.rating;
    let comment = req.body.comment;
    let review = await db.Review.create({ user_id: user_id, product_id: product_id, rating: rating, comment: comment });
    review = await db.Review.findOne({ where: { id: review.id }, include: { model: db.User } });
    return res.json(review);

    // return res.redirect('/shop/' + product_id);
}

exports.showReviews = async (req, res, next) => {
    if (!req.params.id) {
        return res.redirect('/shop');
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.redirect('/shop');
    }
    let page = req.query.page || 1;
    let offset = (page - 1) * 3;
    let reviews = await db.Review.findAll({ where: { product_id: id }, include: { model: db.User }, offset: offset, limit: 3, order: [['id', 'DESC']] });

    return res.send(reviews);
}