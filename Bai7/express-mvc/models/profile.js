'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Profile extends Model {
        static associate(models) {
            // Định nghĩa quan hệ One-to-One: Profile belongs to User
            Profile.belongsTo(models.User, {
                foreignKey: 'userId', // Khóa ngoại trong bảng Profiles
                as: 'user' // Alias cho quan hệ
            });
        }
    }
    Profile.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        bio: DataTypes.TEXT,
        userId: { // Khóa ngoại liên kết với User
            type: DataTypes.INTEGER,
            unique: true // Đảm bảo quan hệ One-to-One
        }
    }, {
        sequelize,
        modelName: 'Profile',
        timestamps: true,
    });
    return Profile;
};