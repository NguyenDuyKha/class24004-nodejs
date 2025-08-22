# Installation
```sh
npm init -y
npm install --save-dev nodemon

Add `"dev": "nodemon server.js"` in scripts of package.js
npm run dev

npm install express cookie-parser

npm install sequelize mysql2
npm install dotenv

npm install express-session express-mysql-session
```

# In .env
```sh
DB_DIALECT=mysql
DB_DATABASE=express_auth_demo
DB_USERNAME=root
DB_PASSWORD=root
DB_HOST=127.0.0.1
DB_PORT=3306

SESSION_SECRET=thisisasecretkey
```