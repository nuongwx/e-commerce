const { all } = require("../app");
const crypto = require('crypto');

module.exports = (sequelize, Sequelize) => {
    const users = sequelize.define("users", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.BLOB,
            set(value) {
                let salt = crypto.randomBytes(16);
                this.setDataValue('salt', salt);
                this.setDataValue('password', crypto.pbkdf2Sync(value, salt, 310000, 32, 'sha256'));
            }
        },
        salt: {
            type: Sequelize.BLOB
        },
        name: {
            type: Sequelize.STRING
        },
        emailVerified: {
            type: Sequelize.BOOLEAN
        },
        image: {
            type: Sequelize.STRING
        },
    }, {
        timestamps: true
    });

    // users.associate = function (models) {
    //     users.hasMany(models.orders, {
    //         foreignKey: 'userId',
    //         as: 'orders'
    //     });
    // };

    return users;
};

// module.exports = (sequelize, Sequelize) => {
//     db.serialize(function() {
//         // create the database schema for the todos app
//         db.run("CREATE TABLE IF NOT EXISTS users ( \
//           id INTEGER PRIMARY KEY, \
//           username TEXT UNIQUE, \
//           hashed_password BLOB, \
//           salt BLOB, \
//           name TEXT, \
//           email TEXT UNIQUE, \
//           email_verified INTEGER \
//         )");
        
//         db.run("CREATE TABLE IF NOT EXISTS federated_credentials ( \
//           id INTEGER PRIMARY KEY, \
//           user_id INTEGER NOT NULL, \
//           provider TEXT NOT NULL, \
//           subject TEXT NOT NULL, \
//           UNIQUE (provider, subject) \
//         )");
        
//         db.run("CREATE TABLE IF NOT EXISTS todos ( \
//           id INTEGER PRIMARY KEY, \
//           owner_id INTEGER NOT NULL, \
//           title TEXT NOT NULL, \
//           completed INTEGER \
//         )");
        
//         // create an initial user (username: alice, password: letmein)
//         var salt = crypto.randomBytes(16);
//         db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
//           'alice',
//           crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
//           salt
//         ]);
//       });
      
//       module.exports = db;
