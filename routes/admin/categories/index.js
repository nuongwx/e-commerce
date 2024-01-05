const express = require('express');
const router = express.Router();
const db = require('../../../models');

router.get('/', async (req, res, next) => {
    let categories = await db.Category.findAll({ order: [['id', 'ASC']] });
    return res.render('admin/categories/index', { title: 'Admin', categories: categories });
});

router.post('/', async (req, res, next) => {
    let category = await db.Category.findOrCreate({ where: { name: req.body.name } });
    return res.json(category[0]);
});

router.post('/:id', async (req, res, next) => {
    let category = await db.Category.findOne({ where: { id: req.params.id } });
    if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
    }
    category.name = req.body.name;
    await category.save();
    return res.json(category);
});

router.delete('/:id', async (req, res, next) => {
    let category = await db.Category.findOne({ where: { id: req.params.id } });
    if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
    }
    await category.destroy();
    return res.json({ message: 'Category deleted.' });
});

// TODO: list category, press Add for a form to POST to /admin/category, each lines has Details btn, Details button open a modal with a list of products in that category, together with a edit form for editing the category, Delete button delete the category and all products in that category
router.get('/:id', async (req, res, next) => {
    let category = await db.Category.findOne({ where: { id: req.params.id } });
    if (!category) {
        return res.status(404).json({ message: 'Category not found.' });
    }
    let products = await db.Product.findAll({ where: { category_id: req.params.id }, order: [['id', 'ASC']] });
    return res.json(products);
});


module.exports = router;