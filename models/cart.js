"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: "user_id",
            });
            // Cart.belongsTo(models.Session, {
            //     foreignKey: "session_id",
            // });
            Cart.hasMany(models.CartItem, {
                foreignKey: "cart_id",
            });
        }
    };
    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // items: {
        //     type: DataTypes.ARRAY(DataTypes.INTEGER),
        //     // allowNull: false,
        // },
        user_id: {
            type: DataTypes.INTEGER,
            // allowNull: true,
        },
        session_id: {
            type: DataTypes.STRING,
            // allowNull: true,
        },
        total: {
            type: DataTypes.VIRTUAL,
            get() {
                let total = 0;
                this.CartItems.forEach(item => {
                    total += item.Product.price * item.quantity;
                });
                return total;
            }
        },
        // quantity: {
        //     type: DataTypes.ARRAY(DataTypes.INTEGER),
        //     // allowNull: true,
        // },
    }, {
        sequelize,
        timestamps: true
    });
    return Cart;
}