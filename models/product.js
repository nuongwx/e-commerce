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
                return this.getDataValue('images')[0];
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