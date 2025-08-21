const http = require('http');
const fs = require('fs').promises;
const PORT = 3000;
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS cho demo, KHÔNG dùng '*' trong production!
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    try {
        const path = req.url; // Sử dụng trực tiếp req.url thay vì new URL
        const method = req.method;
        if (path === '/categories') {
            if (method === 'GET') {
                await handleGetCategories(req, res);
            } else if (method === 'POST') {
                await handleCreateCategory(req, res);
            } else {
                sendErrorResponse(res, 405, 'Method Not Allowed');
            }
        } else if (path.startsWith('/categories/')) {
            const categoryId = parseInt(path.split('/')[2]);
            if (isNaN(categoryId)) {
                sendErrorResponse(res, 400, 'ID danh mục không hợp lệ');
                return;
            }
            if (method === 'GET') {
                await handleGetCategoryById(req, res, categoryId);
            } else if (method === 'PUT' || method === 'PATCH') {
                await handleUpdateCategory(req, res, categoryId);
            } else if (method === 'DELETE') {
                await handleDeleteCategory(req, res, categoryId);
            } else {
                sendErrorResponse(res, 405, 'Method Not Allowed');
            }
        } else {
            sendErrorResponse(res, 404, 'Not Found');
        }
    } catch (error) {
        console.error('Lỗi server:', error);
        sendErrorResponse(res, 500, 'Lỗi server');
    }
});
// --- Phần xử lý Categories (Bài tập 2) ---
async function handleGetCategories(req, res) {
    try {
        const data = await fs.readFile('categories.json', 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);
    } catch (error) {
        sendErrorResponse(res, 500, 'Lỗi đọc dữ liệu danh mục');
    }
}
async function handleGetCategoryById(req, res, categoryId) {
    try {
        const data = await fs.readFile('categories.json', 'utf8');
        const categories = JSON.parse(data);
        const category = categories.find(c => c.id === categoryId);
        if (category) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(category));
        } else {
            sendErrorResponse(res, 404, 'Không tìm thấy danh mục');
        }
    } catch (error) {
        sendErrorResponse(res, 500, 'Lỗi đọc dữ liệu danh mục');
    }
}
async function handleCreateCategory(req, res) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            const newCategory = JSON.parse(body);
            const data = await fs.readFile('categories.json', 'utf8');
            const categories = JSON.parse(data);
            newCategory.id = categories.length + 1;
            categories.push(newCategory);
            await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newCategory));
        } catch (error) {
            sendErrorResponse(res, 400, 'Dữ liệu danh mục không hợp lệ');
        }
    });
}
async function handleUpdateCategory(req, res, categoryId) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
        try {
            const updatedCategory = JSON.parse(body);
            const data = await fs.readFile('categories.json', 'utf8');
            let categories = JSON.parse(data);
            const categoryIndex = categories.findIndex(c => c.id === categoryId);
            if (categoryIndex === -1) {
                sendErrorResponse(res, 404, 'Không tìm thấy danh mục');
                return;
            }
            categories[categoryIndex] = { ...categories[categoryIndex], ...updatedCategory, id: categoryId };
            await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(categories[categoryIndex]));
        } catch (error) {
            sendErrorResponse(res, 400, 'Dữ liệu danh mục không hợp lệ');
        }
    });
}
async function handleDeleteCategory(req, res, categoryId) {
    try {
        const data = await fs.readFile('categories.json', 'utf8');
        let categories = JSON.parse(data);
        const categoryIndex = categories.findIndex(c => c.id === categoryId);
        if (categoryIndex === -1) {
            sendErrorResponse(res, 404, 'Không tìm thấy danh mục');
            return;
        }
        categories.splice(categoryIndex, 1);
        await fs.writeFile('categories.json', JSON.stringify(categories, null, 2));
        res.writeHead(204, { 'Content-Type': 'No Content' });
        res.end();
    } catch (error) {
        sendErrorResponse(res, 500, 'Lỗi xóa danh mục');
    }
}
function sendErrorResponse(res, statusCode, message) {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
    res.end(message);
}
server.listen(PORT, () => {
    console.log(`Server đang lắng nghe tại http://localhost:${PORT}`);
});