const passport = require('../../middleware/passport');
const db = require('../../models/index');
const jwt = require('jsonwebtoken');

exports.login = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }

        if (!user) {
            return res.render('auth/index', { title: 'Login', message: 'Invalid email or password', layout: 'auth/layout' });
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
    res.render('auth/index', { title: 'Login', layout: 'auth/layout' });
}

exports.getRegister = function (req, res) {
    res.render('auth/index', { title: 'Register', layout: 'auth/layout' });
}

exports.register = async function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(400).json({error: 'Invalid email and/or password'});
    } 
    const tempUser = await db.User.findOne({ where: { email: email }});
    
    if (tempUser) {
        return res.status(400).json({ error: 'Email already exists' })
    }

    db.User.create({
        email: email,
        password: password
    }).then(function (user) {
        const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
        const link = process.env.HOST + '/auth/verify-email?token=' + token;
        console.log(link);
        return res.status(200).json({ link: link });
    });
}

exports.ensureLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log("authenticated");
        return next();
    }
    res.redirect('/auth/index');
}

exports.verifyEmail = async function (req, res) {
    let token = req.query.token;
    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await db.User.findOne({ where: { id: verified._id } });
        if (user) {
            user.update({
                verified: true
            }).then(function (user) {
                return res.redirect('/auth/login');
            });
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}

exports.forgotPassword = async function (req, res) {
    let email = req.body.email;
    if (!email) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    const user = await db.User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ error: 'Email does not exist' });
    }
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    const link = process.env.HOST + '/auth/reset-password?token=' + token;
    console.log(link);
    return res.status(200).json({ link: link });
}

exports.resetPassword = async function (req, res) {
    let token = req.query.token;
    let password = req.body.password;
    if (!token) {
        return res.status(400).json({ error: 'Invalid token' });
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await db.User.findOne({ where: { id: verified._id } });
        if (user) {
            user.update({
                password: password
            }).then(function (user) {
                return res.redirect('/auth/login');
            });
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
}