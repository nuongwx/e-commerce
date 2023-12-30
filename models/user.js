const bcrypt = require('bcrypt');

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Review, {
                foreignKey: "user_id",
            });
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(value) {
                let salt = bcrypt.genSaltSync(10);
                this.setDataValue('password', bcrypt.hashSync(value, salt));
            }
        },
        image: {
            type: DataTypes.TEXT,
            defaultValue: "https://via.placeholder.com/150"
        },
        name: {
            type: DataTypes.TEXT
        },
        role: {
            type: DataTypes.ENUM('admin', 'user'),
            defaultValue: 'user'
        },
        status: {
            type: DataTypes.ENUM('active', 'banned'),
            defaultValue: 'active'
        },
        verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    }, {
        sequelize,
        timestamps: true
    });
    return User;
}
