const express = require('express');
const router = express.Router();

const db = require('../../../models/index');


router.get('/', function (req, res, next) {
    db.User.findAll().then(function (users) {
        res.render('admin/users/index', { title: 'Admin', users: users });
    });
});

router.get('/:id', async function (req, res, next) {
    db.User.findByPk(req.params.id).then(function (user) {
        res.render('admin/users/edit-user', { title: 'Admin', user: user });
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