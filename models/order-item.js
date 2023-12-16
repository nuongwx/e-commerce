"use strict"
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, {
                foreignKey: "order_id",
            });
            OrderItem.belongsTo(models.Product, {
                foreignKey: "product_id",
            });
        }
    };
    OrderItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        order_id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        total: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.Product.price * this.quantity;
            }
        },
    }, {
        sequelize,
        timestamps: true
    });
    return OrderItem;
}