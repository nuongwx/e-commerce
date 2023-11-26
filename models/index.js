const { Sequelize, DataTypes } = require('sequelize');
const crypto = require('crypto');

const sequelize = new Sequelize('postgres://postgres:1@localhost:5432/ecommerce');
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users.js")(sequelize, Sequelize);
db.products = require("./products.js")(sequelize, Sequelize);

db.sequelize.sync({ force: true }).then(() => {
    console.log(`Database & tables created!`);
    db.products.create({
        name: 'product1',
        price: 100,
        description: 'description1',
        image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
        category: 'category1'
    });
    db.products.create({
        name: 'product2',
        price: 200,
        description: 'description2',
        image: 'https://courses.ctda.hcmus.edu.vn/pluginfile.php/1/theme_academi/logo/1699841963/fit-logo-chuan-V2-MOODLE.png',
        category: 'category2'
    });
    db.users.create({
        email: 'ngwx@ngwx.co',
        password: '1'
    });
});


module.exports = db;