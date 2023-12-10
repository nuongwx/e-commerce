"use strict"
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Session extends Model {
        static associate(models) {
            Session.hasMany(models.Cart, {
                foreignKey: "session_id",
            });
        }
    };
    Session.init({
        sid: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        expires: DataTypes.DATE,
        data: DataTypes.TEXT
    }, {
        sequelize,
        timestamps: true
    });
    return Session;
}