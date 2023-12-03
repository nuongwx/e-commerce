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
        name: {
            type: DataTypes.TEXT
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
    }, {
        sequelize,
        timestamps: true
    });
    return User;
}
