const db = require("../../models/index.js");

exports.showList = async (req, res, next) => {
    let query = {};
    for (let key in req.query) {
        if (req.query[key]) {
            query[key] = req.query[key].trim().toLowerCase();
            if (query[key].length === 0 || query[key] === 'all') {
                delete query[key];
            }
        }
    }
    let offset = 0;
    if (query.page && query.page.length > 0) {
        let page = parseInt(query.page);
        if (page > 0) {
            offset = (page - 1) * 3;
            delete query.page;
        }
    }
    if (query.name && query.name.length > 0) {
        if (query.name === 'all') {
            delete query.name;
        }
        else {
            query.name = query.name.trim().replace(/\s+/g, ' ');
            query.name = { [db.Sequelize.Op.match]: db.Sequelize.fn('websearch_to_tsquery', query.name) };
            // query.name = { [db.Sequelize.Op.substring]: query.name };
        }
    }
    if (query.category_id && query.category_id.length > 0) {
        query.category_id = parseInt(query.category_id);
    }
    if (query.min && query.min.length > 0 && query.max && query.max.length > 0) {
        query.price = { [db.Sequelize.Op.between]: [query.min, query.max] };
        delete query.min;
        delete query.max;
    }
    let order = [['id', 'ASC']];
    if (query.sort && query.sort.length > 0 && query.order && query.order.length > 0) {
        if (query.sort === 'price' || query.sort === 'name') {
            order = [[query.sort, query.order]];
        }
        delete query.sort;
        delete query.order;
    }

    for (let key in query) {
        if (key !== 'price' && key !== 'category_id' && key !== 'name' && key !== 'sort' && key !== 'order') {
            delete query[key];
        }
    }

    let products = await db.Product.findAndCountAll({ where: query, order: order, limit: 3, offset: offset });
    // let categories = await db.Product.findAll({ attributes: ['category'], group: ['category'] });
    let categories = await db.Category.findAll();
    return res.render('shop/shop', { products: products, categories: categories });


}

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

    return res.render('shop/product', { product: product, reviews: reviews, related_products: relatedProducts});
}

exports.addReview = async (req, res, next) => {
    if (!req.user.id || !req.params.id) {
        return res.redirect('/shop');
    }
    let product_id = req.params.id;
    let user_id = req.user.id;
    let rating = req.body.rating;
    let comment = req.body.comment;
    let review = await db.Review.create({ user_id: user_id, product_id: product_id, rating: rating, comment: comment });

    return res.redirect('/shop/' + product_id);
}