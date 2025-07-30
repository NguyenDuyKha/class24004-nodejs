'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProductTag extends Model {
        static associate(models) {
            // Không cần định nghĩa associate ở đây, vì ProductTag chỉ là bảng trung gian
        }
    }
    ProductTag.init({
        // Không cần định nghĩa thuộc tính cụ thể, Sequelize sẽ tự tạo productId và tagId
    }, {
        sequelize,
        modelName: 'ProductTag',
        tableName: 'ProductTags', // Tên bảng trung gian
        timestamps: true,
    });
    return ProductTag;
};