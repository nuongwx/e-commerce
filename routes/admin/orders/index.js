const express = require('express');
const router = express.Router();

const db = require('../../../models/index');
const Op = db.Sequelize.Op;

router.get('/', async (req, res) => {
    let sortOrder = [['createdAt', 'DESC']];
    if (req.query.sort === 'asc') {
        sortOrder[0][1] = 'ASC';
    }
    let status = req.query.status;
    if (status != 'completed' && status != 'cancelled' && status != 'pending') {
        status = {
            [Op.ne]: null,
        };
    }

    const orders = await db.Order.findAll({
        include: [
            {
                model: db.OrderItem,
                include: [db.Product],
            },
        ],
        order: sortOrder,
        where: {
            status: status,
        },
    });
    res.render('admin/orders/index', { orders });
});

router.get('/:id', async (req, res) => {
    const order = await db.Order.findByPk(req.params.id, {
        include: [
            {
                model: db.OrderItem,
                include: [db.Product],
            },
        ],
    });
    res.render('admin/orders/edit-orders', { order });
    // res.json(order);
});

router.put('/:id', async (req, res) => {
    const order = await db.Order.findByPk(req.params.id);
    await order.update(req.body);
    res.json(order);
});

module.exports = router;