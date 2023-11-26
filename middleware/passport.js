var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../models/index.js');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function verify(email, password, cb) {
    console.log("verify");
    let sql = "SELECT * FROM users WHERE email = ?;";
    db.sequelize.query(sql, {
        replacements: [email],
        type: db.sequelize.QueryTypes.SELECT
    }).then(function (users) {
        if (users.length === 0) { return cb(null, false); }
        if (!users) { return cb(null, false); }
        var user = users[0];

        var hashed_password = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256');
        console.log("######################");
        console.log(hashed_password);
        console.log(user.password);
        console.log("######################");
        if (hashed_password.toString('hex') !== user.password.toString('hex')) {
            console.log("failed");
            return cb(null, false);
        }
        return cb(null, user);
    });
    // db.users.findOne({ where: { email: email } }).then(function (user) {
    //     if (!user) { return cb(null, false); }
    //     var hashed_password = crypto.pbkdf2Sync(password, user.salt, 310000, 32, 'sha256');
    //     console.log(hashed_password.toString('hex'));
    //     if (hashed_password.toString('hex') !== user.password) {
    //         console.log("failed");
    //         return cb(null, false);
    //     }
    //     return cb(null, user);
    // });
}));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

module.exports = passport;