// 1. Cài Đặt Express-validator
// npm install express-validator

// middlewares/validationErrorHandler.js
const { validationResult } = require('express-validator');
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
module.exports = handleValidationErrors;

// validators/bookValidator.js
const { body, param, query } = require('express-validator');
const { Author, Genre } = require('../models');
const listBooksValidationRules = () => [
    query('title')
        .optional()
        .isString().withMessage('Tiêu đề phải là chuỗi ký tự')
        .isLength({ max: 255 }).withMessage('Tiêu đề không được vượt quá 255 ký tự')
        .trim(),
    query('publishYear')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Năm xuất bản phải từ 1000 đến ${new Date().getFullYear()}`)
        .toInt(),
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page phải là số nguyên dương')
        .toInt(),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit phải từ 1 đến 100')
        .toInt(),
];
const bookIdParamValidation = () => [
    param('id')
        .isInt({ min: 1 }).withMessage('ID sách phải là số nguyên dương'),
];
const createBookValidationRules = () => [
    body('title')
        .notEmpty().withMessage('Tiêu đề sách không được để trống')
        .isLength({ min: 2, max: 255 }).withMessage('Tiêu đề sách phải từ 2 đến 255 ký tự')
        .trim(),
    body('isbn')
        .notEmpty().withMessage('ISBN không được để trống')
        .isLength({ min: 10, max: 13 }).withMessage('ISBN phải từ 10 đến 13 ký tự')
        .trim(),
    body('publishYear')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Năm xuất bản phải từ 1000 đến ${new Date().getFullYear()}`)
        .toInt(),
    body('authorId')
        .notEmpty().withMessage('ID tác giả không được để trống')
        .isInt({ min: 1 }).withMessage('ID tác giả phải là số nguyên dương')
        .custom(async (value) => {
            const author = await Author.findByPk(value);
            if (!author) {
                throw new Error('Tác giả không tồn tại');
            }
            return true;
        }),
    body('genreIds')
        .optional()
        .isArray().withMessage('genreIds phải là một mảng')
        .custom(async (genreIds) => {
            if (genreIds && genreIds.length > 0) {
                const genres = await Genre.findAll({ where: { id: genreIds } });
                if (genres.length !== genreIds.length) {
                    throw new Error('Một hoặc nhiều thể loại không tồn tại');
                }
            }
            return true;
        }),
];
const updateBookValidationRules = () => [
    body('title')
        .optional()
        .isLength({ min: 2, max: 255 }).withMessage('Tiêu đề sách phải từ 2 đến 255 ký tự')
        .trim(),
    body('isbn')
        .optional()
        .isLength({ min: 10, max: 13 }).withMessage('ISBN phải từ 10 đến 13 ký tự')
        .trim(),
    body('publishYear')
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Năm xuất bản phải từ 1000 đến ${new Date().getFullYear()}`)
        .toInt(),
    body('authorId')
        .optional()
        .isInt({ min: 1 }).withMessage('ID tác giả phải là số nguyên dương')
        .custom(async (value) => {
            if (value) {
                const author = await Author.findByPk(value);
                if (!author) {
                    throw new Error('Tác giả không tồn tại');
                }
            }
            return true;
        }),
    body('genreIds')
        .optional()
        .isArray().withMessage('genreIds phải là một mảng')
        .custom(async (genreIds) => {
            if (genreIds && genreIds.length > 0) {
                const genres = await Genre.findAll({ where: { id: genreIds } });
                if (genres.length !== genreIds.length) {
                    throw new Error('Một hoặc nhiều thể loại không tồn tại');
                }
            }
            return true;
        }),
];
module.exports = {
    listBooksValidationRules,
    bookIdParamValidation,
    createBookValidationRules,
    updateBookValidationRules,
};

// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const { Book, Author, Genre } = require('../models');
const { Op } = require('sequelize');
const {
    listBooksValidationRules,
    bookIdParamValidation,
    createBookValidationRules,
    updateBookValidationRules,
} = require('../validators/bookValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
// GET all books with filters, sorting, and pagination
router.get('/', listBooksValidationRules(), handleValidationErrors, async (req, res, next) => {
    try {
        const { page = 1, limit = 10, title, publishYear } = req.query;
        const offset = (page - 1) * limit;
        const where = {};
        if (title) where.title = { [Op.like]: `%${title}%` };
        if (publishYear) where.publishYear = { [Op.eq]: publishYear };
        const books = await Book.findAll({
            where,
            include: [
                { model: Author, as: 'author', attributes: ['id', 'name'] },
                { model: Genre, as: 'genres', attributes: ['id', 'name'], through: { attributes: [] } },
            ],
            order: [['publishYear', 'DESC'], ['title', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });
        res.json(books);
    } catch (error) {
        next(error);
    }
});
// GET book by ID with relations
router.get('/:id', bookIdParamValidation(), handleValidationErrors, async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [
                { model: Author, as: 'author', attributes: ['id', 'name'] },
                { model: Genre, as: 'genres', attributes: ['id', 'name'], through: { attributes: [] } },
            ],
        });
        if (!book) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.json(book);
    } catch (error) {
        next(error);
    }
});
// POST create a new book
router.post('/', createBookValidationRules(), handleValidationErrors, async (req, res, next) => {
    try {
        const { title, isbn, publishYear, authorId, genreIds } = req.body;
        const book = await Book.create({ title, isbn, publishYear, authorId });
        if (genreIds && genreIds.length > 0) {
            await book.setGenres(genreIds);
        }
        const createdBook = await Book.findByPk(book.id, {
            include: [
                { model: Author, as: 'author', attributes: ['id', 'name'] },
                { model: Genre, as: 'genres', attributes: ['id', 'name'], through: { attributes: [] } },
            ],
        });
        res.status(201).json(createdBook);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'ISBN đã tồn tại' });
        }
        next(error);
    }
});
// PUT update a book
router.put('/:id', [...bookIdParamValidation(), ...updateBookValidationRules()], handleValidationErrors, async (req, res, next) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Không tìm thấy sách' });
        }

        const { title, isbn, publishYear, authorId, genreIds } = req.body;
        const updatedData = {};
        if (title !== undefined) updatedData.title = title;
        if (isbn !== undefined) updatedData.isbn = isbn;
        if (publishYear !== undefined) updatedData.publishYear = publishYear;
        if (authorId !== undefined) updatedData.authorId = authorId;
        await book.update(updatedData);
        if (genreIds !== undefined) {
            await book.setGenres(genreIds);
        }
        const updatedBook = await Book.findByPk(book.id, {
            include: [
                { model: Author, as: 'author', attributes: ['id', 'name'] },
                { model: Genre, as: 'genres', attributes: ['id', 'name'], through: { attributes: [] } },
            ],
        });
        res.json(updatedBook);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'ISBN đã tồn tại' });
        }
        next(error);
    }
});
// DELETE a book
router.delete('/:id', bookIdParamValidation(), handleValidationErrors, async (req, res, next) => {
    try {
        const deleted = await Book.destroy({ where: { id: req.params.id } });
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy sách' });
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});
module.exports = router;

// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const bookRoutes = require('./routes/bookRoutes');
const db = require('./models');
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use('/api/books', bookRoutes);

// Middleware xử lý lỗi tổng quát
// Tự bổ sung thêm (Bài 5)

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Đã xảy ra lỗi server', error: err.message });
});
db.sequelize.authenticate()
    .then(() => console.log('Kết nối cơ sở dữ liệu thành công!'))
    .catch(err => console.error('Không thể kết nối:', err));
app.listen(PORT, () => {
    console.log(`Server đang chạy tại <http://localhost>:${PORT}`);
});