const express = require('express');
const router = express.Router();
const db = require('../../../models');

router.get('/', async (req, res, next) => {
    // yes, this is a very inefficient way to do this, but it's the only way I can think of right now
    let orders = await db.Order.findAll({include: {model: db.OrderItem, include: {model: db.Product}}});

    let daily = [];
    // push revenue for each day for the last 7 days into daily
    for (let i = 0; i < 7; i++) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        let revenue = 0;
        orders.forEach(function (order) {
            if (order.createdAt.getDate() === date.getDate() && order.createdAt.getMonth() === date.getMonth() && order.createdAt.getFullYear() === date.getFullYear()) {
                console.log(order.total);
                revenue += order.total;
            }
        });
        daily.push({ date: date, revenue: revenue });
    }

    let monthly = [];
    // push revenue for each month for the last 12 months into monthly
    for (let i = 0; i < 12; i++) {
        let date = new Date();
        date.setMonth(date.getMonth() - i);
        let revenue = 0;
        orders.forEach(function (order) {
            if (order.createdAt.getMonth() === date.getMonth() && order.createdAt.getFullYear() === date.getFullYear()) {
                revenue += order.total;
            }
        });
        monthly.push({ date: date, revenue: revenue });
    }

    let yearly = [];
    // push revenue for each year for the last 5 years into yearly
    for (let i = 0; i < 5; i++) {
        let date = new Date();
        date.setFullYear(date.getFullYear() - i);
        let revenue = 0;
        orders.forEach(function (order) {
            if (order.createdAt.getFullYear() === date.getFullYear()) {
                revenue += order.total;
            }
        });
        yearly.push({ date: date, revenue: revenue });
    }

    let total = 0;
    orders.forEach(function (order) {
        total += order.total;
    });

    console.log(daily);
    console.log(monthly);
    console.log(yearly);

    res.json({ daily: daily, monthly: monthly, yearly: yearly, total: total });
});

module.exports = router;