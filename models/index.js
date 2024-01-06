const { Sequelize, DataTypes } = require('sequelize');

console.log(process.env.DATABASE_NAME);

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
});
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require("./user.js")(sequelize, Sequelize);
db.Category = require("./category.js")(sequelize, Sequelize);
db.Product = require("./product.js")(sequelize, Sequelize);
db.Review = require("./review.js")(sequelize, Sequelize);
db.Cart = require("./cart.js")(sequelize, Sequelize);
db.CartItem = require("./cart-item.js")(sequelize, Sequelize);
db.Order = require("./order.js")(sequelize, Sequelize);
db.OrderItem = require("./order-item.js")(sequelize, Sequelize);
db.Session = require("./session.js")(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
if (process.env.NODE_ENV === 'development') {
    db.sequelize.sync({ force: true }).then(async () => {
        console.log(`Database & tables created!`);
        await db.sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 5;');
        await db.sequelize.query('ALTER SEQUENCE "Categories_id_seq" RESTART WITH 4;');
        await db.sequelize.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 11;');
        await db.sequelize.query('ALTER SEQUENCE "Reviews_id_seq" RESTART WITH 2;');
        await db.sequelize.query('ALTER SEQUENCE "Carts_id_seq" RESTART WITH 1;');
    
        await db.User.create({
            id: 1,
            email: 'ngwx@ngwx.co',
            password: '1',
            role: 'admin',
            verified: true,
        });
        await db.User.create({
            id: 2,
            email: '10@10.co',
            password: '1',
        });
        await db.User.create({
            id: 3,
            email: '11@11.co',
            password: '1',
            status: 'banned',
            verified: true,
        });
        await db.User.create({
            id: 4,
            email: '12@12.co',
            password: '1',
        });
        await db.Category.create({
            id: 1,
            name: 'Tea',
        });
        await db.Category.create({
            id: 2,
            name: 'Milk',
        });
        await db.Category.create({
            id: 3,
            name: 'Coffee',
        });
        await db.Product.create({
            id: 1,
            name: 'Tea 1',
            price: 100,
            description: 'Chai',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '1',
        });
        await db.Product.create({
            id: 2,
            name: 'Milk 1',
            price: 200,
            description: 'The cat likes it',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '2',
        });
        await db.Product.create({
            id: 3,
            name: 'Milk 2',
            price: 300,
            description: 'Really good milk',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '2',
        });
        await db.Product.create({
            id: 4,
            name: 'Milk 3',
            price: 400,
            description: 'Pink milk',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '2',
        });
        await db.Product.create({
            id: 5,
            name: 'Coffee 1',
            price: 500,
            description: 'Latte',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '3',
        });
        await db.Product.create({
            id: 6,
            name: 'Coffee 2',
            price: 600,
            description: 'Coffee?',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '3',
        });
        await db.Product.create({
            id: 7,
            name: 'Coffee 3',
            price: 700,
            description: 'Iced coffee',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '3',
        });
        await db.Product.create({
            id: 8,
            name: 'Coffee 4',
            price: 800,
            description: 'Warm cup of coffee',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '3',
        });
        await db.Product.create({
            id: 9,
            name: 'Tea 2',
            price: 900,
            description: 'A nice cup of tea',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '1',
        });
        await db.Product.create({
            id: 10,
            name: 'Tea 3',
            price: 1000,
            description: 'A cup of tea',
            image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
            category_id: '1',
        });
        await db.Review.create({
            user_id: 1,
            product_id: 1,
            rating: 5,
            comment: 'an comment',
        });
        await db.Review.create({
            user_id: 2,
            product_id: 1,
            rating: 4,
            comment: 'comment2'
        });
        await db.Review.create({
            user_id: 3,
            product_id: 1,
            rating: 3,
            comment: 'comment3'
        });
        await db.Review.create({
            user_id: 4,
            product_id: 1,
            rating: 2,
            comment: 'comment4'
        });
        await db.Review.create({
            user_id: 1,
            product_id: 2,
            rating: 5,
            comment: 'comment5'
        });
        await db.Review.create({
            user_id: 2,
            product_id: 2,
            rating: 4,
            comment: 'comment6'
        });
        await db.Review.create({
            user_id: 3,
            product_id: 2,
            rating: 3,
            comment: 'comment7'
        });
        await db.Review.create({
            user_id: 4,
            product_id: 2,
            rating: 2,
            comment: 'comment8'
        });
        let cart1 = await db.Cart.create({
            user_id: 1,
        });
        await db.CartItem.create({
            cart_id: 1,
            product_id: 1,
            quantity: 1,
        });
        await db.CartItem.create({
            cart_id: 1,
            product_id: 2,
            quantity: 2,
        });
        let order1 = await db.Order.create({
            user_id: 1,
        });
        await db.OrderItem.create({
            order_id: 1,
            product_id: 1,
            quantity: 1,
            status: 'pending',
        });
        await db.OrderItem.create({
            order_id: 1,
            product_id: 2,
            quantity: 2,
        });
        let order2 = await db.Order.create({
            user_id: 1,
            createdAt: new Date('2021-04-01T00:00:00Z'),
        });
        await db.OrderItem.create({
            order_id: 2,
            product_id: 1,
            quantity: 1,
        });
        await db.OrderItem.create({
            order_id: 2,
            product_id: 2,
            quantity: 2,
        });
        let order3 = await db.Order.create({
            user_id: 1,
            createdAt: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
        });
        await db.OrderItem.create({
            order_id: 3,
            product_id: 1,
            quantity: 9,
        });
        await db.OrderItem.create({
            order_id: 3,
            product_id: 2,
            quantity: 2,
        });

    });
} else {
    db.sequelize.sync();
}


module.exports = db;