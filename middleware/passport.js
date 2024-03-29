const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models/index.js');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function verify(email, password, cb) {
    db.User.findOne({ where: { email: email } }).then(function (user) {
        if (!user) { return cb({ error: 'User not found' }); }
        else if(user.length === 0) { return cb({ error: 'User not found' }); }
        else if(user.status === 'banned') { return cb({ error: 'User banned' }); }
        bcrypt.compare(password, user.password, function (err, result) {
            if (err) { return cb(err); }
            if (!result) { return cb({ error: 'Incorrect password' }); }
            if(user.verified === false) { return cb({ error: 'Email not verified' }); }
            return cb(null, user);
        });
    });
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email, role: user.role });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = passport;