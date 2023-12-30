const express = require('express');
const router = express.Router();

const db = require('../../../models/index');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');

router.get('/', async (req, res) => {
    db.User.findByPk(req.user.id).then(function (user) {
        res.render('admin/profile/index', { title: 'Admin', user: user });
    });
});

router.post('/', async (req, res) => {
    db.User.findByPk(req.user.id).then(function (user) {
        if (req.body.currentPassword && req.body.newPassword && req.body.confirmNewPassword && req.body.currentPassword !== '' && req.body.newPassword !== '' && req.body.confirmNewPassword !== '') {
            if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
                if (req.body.newPassword === '') {
                    return res.status(400).json({ error: 'Missing new password' })
                }
                else if (req.body.newPassword !== req.body.confirmNewPassword) {
                    return res.status(400).json({ error: 'Passwords pair do not match' })
                } else if (bcrypt.compareSync(req.body.newPassword, user.password)) {
                    return res.status(400).json({ error: 'New password cannot be the same as the old password' })
                }
                console.log('passwords match')
                user.update({
                    password: req.body.newPassword
                }).then(user => {
                    return res.json(user)
                });
            }
            else {
                return res.status(401).json({ error: 'Incorrect password' })
            }
        }
    });
});

router.post('/avatar', async (req, res) => {
    if (!req.files) return res.status(400).json({ error: 'No image provided' });
    db.User.findByPk(req.user.id).then(function (user) {
        cloudinary.uploader.upload_stream({ resource_type: 'image' }, function (error, result) {
            if (error) {
                console.log(error);
            } else {
                user.update({
                    image: result.url
                }).then(async user => {
                    res.json(await user.reload());
                });
            }
        }).end(req.files.image.data);
    });
});

module.exports = router;