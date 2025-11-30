"use strict";

module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define(
        "Order",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            customerName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            note: {
                type: DataTypes.TEXT,
            },
            totalPrice: {
                type: DataTypes.DECIMAL(10, 2),
            },
            status: {
                type: DataTypes.STRING,
                defaultValue: 'pending',
            },
        },
        {
            timestamps: true,
            tableName: 'Order',
        }
    );

    Order.associate = function (models) {
        Order.belongsTo(models.Product, { foreignKey: 'productId' });
        Order.belongsTo(models.User, { foreignKey: 'userId' });
    };

    return Order;
};
