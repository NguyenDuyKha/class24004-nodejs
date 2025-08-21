// 1. File dữ liệu: categories.json
// Đặt file này trong thư mục gốc của dự án:
[
    { "id": 1, "name": "Điện tử", "description": "Sản phẩm công nghệ và điện tử" },
    { "id": 2, "name": "Thời trang", "description": "Quần áo và phụ kiện" }
]

// 2. File Routes:

// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
// GET /categories - Lấy danh sách tất cả danh mục
router.get('/categories', async (req, res, next) => {
    try {
        const data = await fs.readFile('categories.json', 'utf8');
        const categories = JSON.parse(data);
        res.status(200).json(categories);
    } catch (err) {
        next(err); // Truyền lỗi cho error handling middleware
    }
});
// GET /categories/:id - Lấy chi tiết một danh mục theo ID
router.get('/categories/:id', async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            return res.status(400).send('ID danh mục không hợp lệ');
        }
        const data = await fs.readFile('categories.json', 'utf8');
        const categories = JSON.parse(data);
        const category = categories.find(c => c.id === categoryId);
        if (!category) {
            return res.status(404).send('Không tìm thấy danh mục');
        }
        res.status(200).json(category);
    } catch (err) {
        next(err);
    }
});
// POST /categories - Tạo mới một danh mục
router.post('/categories', async (req, res, next) => {
    try {
        const newCategory = req.body;
        if (!newCategory.name || !newCategory.description) {
            return res.status(400).send('Dữ liệu không hợp lệ: Thiếu name hoặc description');
        }
        const data = await fs.readFile('categories.json', 'utf8');
        const categories = JSON.parse(data);
        newCategory.id = categories.length ? categories[categories.length - 1].id + 1 : 1;
        categories.push(newCategory);
        await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
        res.status(201).json(newCategory);
    } catch (err) {
        next(err);
    }
});
// PUT /categories/:id - Cập nhật một danh mục theo ID
router.put('/categories/:id', async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            return res.status(400).send('ID danh mục không hợp lệ');
        }
        const updatedCategory = req.body;
        if (!updatedCategory.name || !updatedCategory.description) {
            return res.status(400).send('Dữ liệu không hợp lệ: Thiếu name hoặc description');
        }
        const data = await fs.readFile('categories.json', 'utf8');
        let categories = JSON.parse(data);
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
            return res.status(404).send('Không tìm thấy danh mục');
        }
        categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategory, id: categoryId };
        await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
        res.status(200).json(categories[categoryIndex]);
    } catch (err) {
        next(err);
    }
});
// DELETE /categories/:id - Xóa một danh mục theo ID
router.delete('/categories/:id', async (req, res, next) => {
    try {
        const categoryId = parseInt(req.params.id);
        if (isNaN(categoryId)) {
            return res.status(400).send('ID danh mục không hợp lệ');
        }
        const data = await fs.readFile('categories.json', 'utf8');
        let categories = JSON.parse(data);
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
            return res.status(404).send('Không tìm thấy danh mục');
        }
        categories.splice(categoryIndex, 1);
        await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
});
module.exports = router;

// 3. File chính: server.js
// server.js
const express = require('express');
const app = express();
const categoryRoutes = require('./routes/categoryRoutes.js');
const requestLoggerMiddleware = require('./middlewares/requestLogger.js');
const errorHandlerMiddleware = require('./middlewares/errorHandler.js');
const PORT = 3000;
app.use(requestLoggerMiddleware); // Middleware ghi log request
app.use(express.json()); // Middleware parse JSON body
// Mount routes
app.use('/api', categoryRoutes); // Routes cho Categories
app.get('/', (req, res) => {
    res.send('Chào mừng đến với Express API!');
});
app.use(errorHandlerMiddleware); // Middleware xử lý lỗi - đặt cuối cùng
app.listen(PORT, () => {
    console.log(`Server Express đang lắng nghe tại <http://localhost>:${PORT}`);
});

// 4.
// middlewares/requestLogger.js
function requestLoggerMiddleware(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
}
module.exports = requestLoggerMiddleware;

// middlewares/errorHandler.js
function errorHandlerMiddleware(err, req, res, next) {
    console.error('ERROR:', err.stack);
    res.status(500).send('Lỗi server. Vui lòng thử lại sau.');
}
module.exports = errorHandlerMiddleware;