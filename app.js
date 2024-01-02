const dotenv = require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var logger = require('morgan');
var flash = require('connect-flash');
const upload = require('express-fileupload');

const { create } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');


var db = require("./models/index.js");

var SequelizeStore = require('connect-session-sequelize')(session.Store);


var homeRouter = require('./routes/home/index');
var cartRouter = require('./routes/cart/cart');
var shopRouter = require('./routes/shop/shop');
const productRouter = require('./routes/product/index');
var checkoutRouter = require('./routes/checkout/checkout');
const orderRouter = require('./routes/order/index');
var authRouter = require('./routes/auth/router');
var profileRouter = require('./routes/user/profile');

const adminRouter = require('./routes/admin/index');

const statisticsRouter = require('./routes/admin/statistics/index');




var app = express();

const hbs = create({
    extname: '.hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, 'views'),
    // partialsDir: path.join(__dirname, 'views/user/partials'),
    helpers: {
        test: function () {
            return 'test';
        },
        ifCond: function (v1, op, v2, options) {
            switch (op) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    },
    handlebars: allowInsecurePrototypeAccess(require('handlebars'))
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function exposeTemplates (req, res, next) {
	// Uses the `ExpressHandlebars` instance to get the get the **precompiled**
	// templates which will be shared with the client-side of the app.
	hbs.getTemplates("views/partials/", {
		// cache: app.enabled("view cache"),
		precompiled: true,
	}).then((templates) => {
		// RegExp to remove the ".handlebars" extension from the template names.
		const extRegex = new RegExp(hbs.extname + "$");

		// Creates an array of templates which are exposed via
		// `res.locals.templates`.
		templates = Object.keys(templates).map((name) => {
			return {
				name: name.replace(extRegex, ""),
				template: templates[name],
			};
		});

		// Exposes the templates during view rendering.
		if (templates.length) {
			res.locals.templates = templates;
		}

		setImmediate(next);
	})
		.catch(next);
}

app.use(exposeTemplates);


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

// generate session for every session, doesn't matter if user is logged in or not
// app.use(function (req, res, next) {
//     if (!req.session.cart) {
//         req.session.cart = {};
//         req.session.cart.items = [];
//         req.session.cart.totalQty = 0;
//         req.session.cart.totalPrice = 0;
//     }
//     next();
// });

app.use(function (req, res, next) {
    res.locals.session = req.session;
    res.locals.user = req.user;
    res.locals.message = req.session.messages;

    next();
});

app.use(flash());
app.use(upload());

// app.use(function (req, res, next) {
//     res.locals.message = req.flash('message');
//     next();
// });

app.use('/auth', function (req, res, next) {
    res.locals.layout = 'auth/layout';
    next();
}, authRouter);

app.use('/', homeRouter);

app.use('/statistics', statisticsRouter);

app.use('/shop', shopRouter);

app.use('/product', productRouter);

app.use('/cart', cartRouter);

app.use('/checkout', checkoutRouter);

app.use('/order', orderRouter);

app.use('/user', profileRouter);

// admin route use different layout
app.use('/admin', function (req, res, next) {
    res.locals.layout = 'admin/layout';
    next();
}, adminRouter);

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
