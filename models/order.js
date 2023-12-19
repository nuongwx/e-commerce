"use strict"
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, {
                foreignKey: "user_id",
            });
            Order.hasMany(models.OrderItem, {
                foreignKey: "order_id",
            });
        }
    };
    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
            defaultValue: 'completed',
        },
        total: {
            type: DataTypes.VIRTUAL,
            get() {
                if(!this.OrderItems) return 0;
                return this.OrderItems.reduce((total, item) => {
                    return total + item.total;
                }, 0);
            }
        },
        // items: {
        //     type: DataTypes.ARRAY(DataTypes.INTEGER),
        //     // allowNull: false,
        // },
        // quantity: {
        //     type: DataTypes.ARRAY(DataTypes.INTEGER),
        //     // allowNull: false,
        // },
    }, {
        sequelize,
        timestamps: true
    });
    return Order;
}