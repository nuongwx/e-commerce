var express = require('express');
const { json } = require('sequelize');
var router = express.Router();

const db = require('../../models');
const e = require('express');
const cloudinary = require('cloudinary').v2;
const bcrypt = require('bcrypt');

var ensureLogIn = require('connect-ensure-login').ensureLoggedIn;

var ensureLoggedIn = ensureLogIn('/auth/login');

/* GET about page. */
router.get('/profile', ensureLoggedIn, function (req, res, next) {
    db.User.findByPk(req.user.id).then(user => {
        res.render('user/profile', { user: user });
    });
});

router.post('/profile', ensureLoggedIn, function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
    db.User.findByPk(req.user.id).then(user => {
        if (req.files && req.files.image) {
            cloudinary.uploader.upload_stream({ resource_type: 'image' },
                async function (error, result) {
                    console.log("image upload result: ", result, error);
                    if (error) {
                        console.log(error);
                    } else {
                        user.update({
                            image: result.url
                        }).then(async user => {
                            res.json(await user.reload());
                        });
                    }
                }
            ).end(req.files.image.data);
        } else {
            if (req.body.currentPassword && req.body.newPassword && req.body.confirmNewPassword && req.body.currentPassword !== '' && req.body.newPassword !== '' && req.body.confirmNewPassword !== '') {
                if (bcrypt.compareSync(req.body.currentPassword, user.password)) {
                    if(req.body.newPassword === '') {
                        return res.status(400).json({ error: 'Missing new password' })
                    }
                    else if (req.body.newPassword !== req.body.confirmNewPassword) {
                        return res.status(400).json({ error: 'Passwords pair do not match' })
                    } else if(bcrypt.compareSync(req.body.newPassword, user.password)) {
                        return res.status(400).json({ error: 'New password cannot be the same as the old password' })
                    }
                    console.log('passwords match')
                    user.update({
                        password: req.body.newPassword
                    }).then(user => {
                        return res.json(user)
                    });
                } else {
                    return res.status(401).json({ error: 'Incorrect password' })
                }
            } else {
                return res.status(400).json({ error: 'Missing password' })
            }
        }
    }, error => {
        console.log(error);
        res.status(404).json({ error: 'UserId not found' })
    });
});

module.exports = router;