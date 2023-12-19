const express = require('express');
const router = express.Router();

const db = require('../../../models/index');

router.get('/', async (req, res) => {
    db.User.findByPk(req.user.id).then(function (user) {
        res.render('admin/profile/index', { title: 'Admin', user: user });
    });
});

router.put('/', async (req, res) => {
    db.User.findByPk(req.user.id).then(function (user) {
        user.update(req.body).then(function (user) {
            res.json(user);
        });
    });
});

module.exports = router;