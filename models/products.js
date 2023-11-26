module.exports = (sequelize, Sequelize) => {
    const products = sequelize.define("products", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            // unique: true
        },
        price: {
            type: Sequelize.INTEGER,
            // allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        image: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        category: {
            type: Sequelize.STRING,
            // allowNull: false,
        },
        // productQuantity: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        // },
    }, {
        timestamps: true
    });

    return products;
}