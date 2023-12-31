const db = require('../../../models');
const cloudinary = require('cloudinary').v2;

exports.createProduct = async (req, res, next) => {
    // create a new, empty product, and return it to the client so that they can fill in the details
    let product = await db.Product.create({});
    return res.redirect('/admin/product/' + product.id);
}

exports.updateProduct = async (req, res, next) => {
    if (!req.params.id) {
        return res.redirect('/shop');
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.redirect('/shop');
    }
    product.name = req.body.name;
    product.price = req.body.price;
    product.description = req.body.description;
    product.image = req.body.image;
    product.category_id = req.body.category_id;
    product.status = req.body.status;
    await product.save();
    return res.json(product);
}

exports.deleteProduct = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    await product.destroy();
    return res.json({ message: 'Product deleted.' });
}

exports.addImage = async (req, res, next) => {
    console.log(req.files);
    if (!req.params.id) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    cloudinary.uploader.upload_stream(async (error, result) => {
        if (error) {
            return res.json(error);
        }
        // product.images.push(result.url);
        // await product.save();
        console.log(result);

        product = await db.Product.findOne({ where: { id: id } });
        product.update({ images: db.sequelize.fn('array_append', db.sequelize.col('images'), result.url) });

        return res.json(product);
    }).end(req.files.image.data);

    // // product.images.push(req.files.image.name);
    // await product.save();
    // return res.json(product);
}

exports.removeImage = async (req, res, next) => {
    if (!req.params.id) {
        return res.status(404).json({ message: 'Product not found.' });
    }
    let id = req.params.id;
    let product = await db.Product.findOne({ where: { id: id } });
    if (!product) {
        return res.json({ message: 'Product not found.' });
    }
    let index = product.images.indexOf(req.body.image);
    if (index > -1) {
        product.update({ images: db.sequelize.fn('array_remove', db.sequelize.col('images'), req.body.image) });
    }
    await product.save();
    return res.json(product);
}

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