"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                foreignKey: "user_id",
            });
        }
    };
    Cart.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        items: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
    }, {
        sequelize,
        timestamps: true
    });
    return Cart;
}