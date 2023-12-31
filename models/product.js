"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.Review, {
                foreignKey: "product_id",
            });
            Product.belongsTo(models.Category, {
                foreignKey: "category_id",
            });
            // cascade delete cart items
            Product.hasMany(models.CartItem, {
                foreignKey: "product_id",
                onDelete: 'CASCADE',
                hooks: true,
            });
            // cascade delete order items
            Product.hasMany(models.OrderItem, {
                foreignKey: "product_id",
                onDelete: 'CASCADE',
                hooks: true,
            });
        }
    }
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            // allowNull: false,
            // unique: true
        },
        price: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            // allowNull: false,
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.TEXT),
            // allowNull: false,
        },
        image: {
            type: DataTypes.VIRTUAL,
            get() {
                if (this.getDataValue('images') && this.getDataValue('images').length > 0) {
                    return this.getDataValue('images')[0];
                }
                return 'https://via.placeholder.com/150';
            },
            set(value) {
                this.setDataValue('images', [value]);
            }
        },
        category_id: {
            type: DataTypes.INTEGER,
            // allowNull: false,
        },
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'inactive'],
            // allowNull: false,
            defaultValue: 'active'
        },
        // stock: {
        //     type: DataTypes.INTEGER,
        //     allowNull: false,
        // },
    }, {
        sequelize,
        timestamps: true
    });
    return Product;
    
}