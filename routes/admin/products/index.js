const express = require('express');
const router = express.Router();

const productController = require('./product-controller');

const db = require('../../../models/index');


router.get('/', productController.getProducts);

router.get('/query', async function (req, res, next) {
    console.log(req.query);
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
    if (query.status && query.status.length > 0) {
        if (query.status === 'all') {
            delete query.status;
        }
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
        if (key !== 'price' && key !== 'category_id' && key !== 'name' && key !== 'status') {
            delete query[key];
        }
    }
    console.log(query);
    let products = await db.Product.findAndCountAll({
        where: query,
        limit: 3,
        offset: offset,
        order: order,
    });
    let categories = await db.Category.findAll();
    return res.json({ products: products, categories: categories });

});

router.get('/create', productController.createProduct);

router.get('/:id', productController.getProductsById);

router.put('/:id', productController.updateProduct);

router.delete('/:id', productController.deleteProduct);

router.post('/:id/image', productController.addImage);

router.delete('/:id/image', productController.removeImage);

module.exports = router;