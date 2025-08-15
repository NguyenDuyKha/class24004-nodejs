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
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            allowNull: false,
            defaultValue: 'user'
        }
    }, {
        sequelize,
        modelName: 'User',
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: ['password']
            },
        },
        scopes: {
            withPassword: {
                attributes: {},
            }
        }
    });
    return User;
};