const passport = require('../../middleware/passport');
const db = require('../../models/index');

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }

        if (!user) {
            return res.render('auth/login', { title: 'Login', message: 'Invalid email or password', layout: 'auth/layout' });
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect('/user/profile');
        });
    })(req, res, next);
}

exports.logout = function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
}

exports.getLogin = function (req, res) {
    res.render('auth/login', { title: 'Login', layout: 'auth/layout' });
}

exports.getRegister = function (req, res) {
    res.render('auth/register', { title: 'Register', layout: 'auth/layout' });
}

exports.register = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.render('auth/register', { title: 'Register', message: 'Invalid email or password', layout: 'auth/layout' });
    } 
    const tempUser = await db.users.findOne({ where: { email: email }});
    
    if (tempUser) {
        return res.render('auth/register', { title: 'Register', message: 'Email already exists', layout: 'auth/layout' });
    }

    db.users.create({
        email: email,
        password: password
    }).then(function (user) {
        res.redirect('/auth/login');
    });
}

exports.ensureLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("authenticated");
        return next();
    }
    res.redirect('/auth/login');
}

