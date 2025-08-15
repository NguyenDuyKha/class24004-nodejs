'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // Belongs to one category (One-to-Many)
            Product.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category'
            });

            // Belongs to many tags (Many-to-Many)
            Product.belongsToMany(models.Tag, {
                through: models.ProductTag,
                foreignKey: 'productId',
                otherKey: 'tagId',
                as: 'tags'
            });
        }
    }

    Product.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: DataTypes.TEXT,
        price: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        categoryId: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'Products', // Tên bảng MySQL
        timestamps: true
    });

    return Product;
};