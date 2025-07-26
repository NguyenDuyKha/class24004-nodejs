const express = require('express');
const productRoutes = require('./routes/productRoute.js');
const requestLoggerMiddleware = require('./middlewares/requestLogger.js')
const errorHandlerMiddleware = require('./middlewares/errorHandler.js')

const app = express();
const PORT = 3000;

app.use(requestLoggerMiddleware);
app.use(express.json())
app.use('/api', productRoutes);

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});