const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();

const productRoutes = require('./routes/productRoute.js');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');

const requestLoggerMiddleware = require('./middlewares/requestLogger.js')
const errorHandlerMiddleware = require('./middlewares/errorHandler.js')

const config = require('./config/config.js');
const db = require('./models'); // Import models/index.js
const PORT = process.env.PORT || 3000;

app.use(requestLoggerMiddleware);
app.use(express.json())

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandlerMiddleware);

db.sequelize.authenticate()
    .then(() => {
        console.log('Kết nối cơ sở dữ liệu thành công!');
    })
    .catch(err => {
        console.error('Không thể kết nối cơ sở dữ liệu:', err);
    });

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});