'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Tag extends Model {
        static associate(models) {
            // Quan hệ Many-to-Many: Tag belongs to many Products thông qua bảng ProductTag
            Tag.belongsToMany(models.Product, {
                through: models.ProductTag, // Bảng trung gian là Model ProductTag
                foreignKey: 'tagId',
                // Khóa ngoại trong bảng ProductTags (tham chiếu Tag)
                otherKey: 'productId',   // Khóa ngoại trong bảng ProductTags (tham chiếu Product)
                as: 'products' // Alias cho quan hệ
            });
        }
    }
    Tag.init({
        name: DataTypes.STRING,
        slug: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Tag',
        timestamps: true,
    });
    return Tag;
};