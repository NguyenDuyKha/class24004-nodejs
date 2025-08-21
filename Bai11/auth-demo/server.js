const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const session = require('express-session');
const cookieParser = require('cookie-parser');
const MySQLStore = require('express-mysql-session')(session);

const config = require('./config/config.js');
const { message } = require('statuses');

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

app.get('/set', (req, res) => {
    req.session.views = (req.session.views || 0) + 1;
    req.session.userData = { name: "Alice", role: "user" };
    req.session.message = "Hello Session !";

    res.json({ message: `Session data set. Views: ${req.session.views}`});
});

app.get('/get', (req, res) => {
    if(req.session.views) {
        console.log(req.session);
        res.json({ message: "Get Session" });
    } else {
        res.json({ message: "No session data. Try /set first."})
    }
});

app.get('/update', (req, res) => {
    if(req.session.userData) {
        req.session.userData.lastSeen = new Date();
        res.json({ message: "Session data update !"})
    } else {
        res.json({ message: "No session data. Try /set first."})
    }
})


app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});