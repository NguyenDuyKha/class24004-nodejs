module.exports = {
    development: {
        dialect: process.env.DB_DIALECT,
        database: process.env.DB_DATABASE,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
    test: { /* ... cấu hình cho môi trường test ... */ },
    production: { /* ... cấu hình cho môi trường production ... */ },
    env: process.env.NODE_ENV || 'development',
    sessionSecret: process.env.SESSION_SECRET
};