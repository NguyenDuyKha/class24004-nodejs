'use strict';

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.Category = require('./category')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.User = require('./user')(sequelize, Sequelize); // Import User model
db.Profile = require('./profile')(sequelize, Sequelize); // Import Profile model
db.Tag = require('./tag')(sequelize, Sequelize);
db.ProductTag = require('./productTag')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;