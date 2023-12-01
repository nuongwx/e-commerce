const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, {
                foreignKey: "user_id",
            });
            Review.belongsTo(models.Product, {
                foreignKey: "product_id",
            });
        }
    }
    Review.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        product_id: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
        comment: {
            type: DataTypes.TEXT,
        },
    }, {
        sequelize,
        timestamps: true
    });
    return Review;
}