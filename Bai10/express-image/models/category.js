'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            Category.hasMany(models.Product, {
                foreignKey: 'categoryId', // Tên khóa ngoại trong bảng Product
                as: 'products' // Alias để truy vấn quan hệ
            });
        }
    }

    Category.init({
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'Categories', // Tên bảng MySQL
        timestamps: true
    });

    return Category;
};