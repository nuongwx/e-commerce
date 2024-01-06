const express = require('express');
const router = express.Router();

const db = require('../../../models/index');


router.get('/', function (req, res, next) {
    db.User.findAll().then(function (users) {
        res.render('admin/users/index', { title: 'Admin', users: users });
    });
});

router.get('/query', async function (req, res, next) {
    let query = {};
    for (let key in req.query) {
        if (req.query[key]) {
            query[key] = req.query[key].trim().toLowerCase();
            if (query[key].length === 0 || query[key] === 'all') {
                delete query[key];
            }
        }
    }
    console.log(query);
    let offset = 0;
    if (query.page && query.page.length > 0) {
        let page = parseInt(query.page);
        if (page > 0) {
            offset = (page - 1) * 3;
            delete query.page;
        }
    }
    console.log(offset);
    if (query.email && query.email.length > 0) {
        if (query.email === 'all') {
            delete query.email;
        }
        else {
            query.email = query.email.trim().replace(/\s+/g, ' ');
            // query.email = { [db.Sequelize.Op.match]: db.Sequelize.fn('websearch_to_tsquery', query.email) };
            query.email = { [db.Sequelize.Op.substring]: query.email };
        }
    }
    let order = [['id', 'ASC']];
    if (query.sort && query.sort.length > 0 && query.order && query.order.length > 0) {
        if(query.sort === 'createdat') {
            query.sort = 'createdAt';
        }
        if (query.sort === 'email' || query.sort === 'createdAt' || query.sort === 'status' || query.sort === 'role') {
            order = [[query.sort, query.order]];
        }
        delete query.sort;
        delete query.order;
    }

    for (let key in query) {
        if (key !== 'email' && key !== 'sort' && key !== 'order') {
            delete query[key];
        }
    }
    console.log(query);
    console.log(order);
    let users = await db.User.findAndCountAll({ where: query, order: order, offset: offset, limit: 3 }).then(function (users) {
        res.json(users);
    });
});

router.get('/:id', async function (req, res, next) {
    db.User.findByPk(req.params.id).then(function (user) {
        res.render('admin/users/edit-user', { title: 'Admin', target: user });
        // res.json(user);
    });
});

router.put('/:id', function (req, res, next) {
    db.User.findByPk(req.params.id).then(function (user) {
        if(user.id === req.user.id) {
            return res.status(403).json({ message: 'You cannot edit your own account role and/or status.' });
        }
        user.update(req.body).then(function (user) {
            res.json(user);
        });
    });
});

router.delete('/:id', function (req, res, next) {
    db.User.findByPk(req.params.id).then(function (user) {
        user.destroy().then(function (user) {
            res.redirect('/admin/users');
        });
    });
});

module.exports = router;