var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var logger = require('morgan');

var db = require("./models/index.js");

var SequelizeStore = require('connect-session-sequelize')(session.Store);


var homeRouter = require('./routes/home/index');
var cartRouter = require('./routes/cart/cart');
var shopRouter = require('./routes/shop/shop');
var checkoutRouter = require('./routes/checkout/checkout');
var authRouter = require('./routes/auth/router');
var profileRouter = require('./routes/user/profile');




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    store: new SequelizeStore({
        db: db.sequelize,
        checkExpirationInterval: 15 * 60 * 1000,
        expiration: 24 * 60 * 60 * 1000
    }),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.authenticate('session'));

app.use('/', homeRouter);

app.use('/shop', shopRouter);

app.use('/cart', cartRouter);

app.use('/checkout', checkoutRouter);

app.use('/auth', authRouter);

app.use('/user', profileRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
