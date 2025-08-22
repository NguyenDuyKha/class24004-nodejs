const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const sessionRoutes = require('./routes/sessionRoutes');
const authRoutes = require('./routes/authRoutes');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config/config.js');

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser());

const dbConfig = config[config.env];
const sessionStoreOptions = {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    clearExpired: true,
    checkExpirationInterval: 1000 * 60 * 10,
    expiration: 1000 * 60 * 60 * 24,
    createDatabaseTable: false,
}
const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(session({
    secret: config.sessionSecret,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === 'production',
    }
}));

app.get('/set-cookie', (req, res) => {
    res.cookie('username', 'guest');
    res.cookie('language', 'vietnamese', { maxAge: 1000 * 60 * 15 });
    res.cookie('data', 'someToken123', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    res.json({ message: "Cookies have been set!"})

});

app.get('/read-cookie', (req, res) => {
    const username = req.cookies.username;
    const language = req.cookies.language;
    const data = req.cookies.data;

    console.log("Cookies: ", req.cookies);

    res.json({
        message: "Get Cookies"
    })
})

app.get('/clear-cookie', (req, res) => {
    res.clearCookie('username');
    res.clearCookie('language');
    res.clearCookie('data', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
    });

    res.json({ message: "Clear cookies"});
})

app.use('/api/session', sessionRoutes);
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});