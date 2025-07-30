'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // Định nghĩa quan hệ One-to-One: User has one Profile
            User.hasOne(models.Profile, {
                foreignKey: 'userId', // Khóa ngoại trong bảng Profiles
                as: 'profile' // Alias cho quan hệ
            });
        }
    }
    User.init({
        username: DataTypes.STRING,
        email: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
    });
    return User;
};