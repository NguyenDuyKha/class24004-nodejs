const express = require('express');
const router = express.Router();
const { Product, Category, Tag, Sequelize } = require('../models'); // Import model Product
// GET all products
router.get('/', async (req, res, next) => {
    const pageNumber = req.query.page;
    const pageSize = 2;
    const offset = (pageNumber - 1) * pageSize;

    try {
        const products = await Product.findAll({
            limit: pageSize,
            offset: offset,
            // where: {
            //     price: {
            //         [ Sequelize.Op.gt ]: 1000,
            //     },
            //     name: {
            //         [ Sequelize.Op.like ]: '%Laptop%'
            //     },
            //     categoryId: {
            //         [ Sequelize.Op.in ]: [2]
            //     }
            // },
            // order: [
            //     // ['price', 'DESC'],
            //     ['categoryId', 'ASC'],
            //     ['name', 'ASC']
            // ],
            include: [
                {
                    model: Category,
                    as: 'category'  // alias bạn đặt trong Product.belongsTo
                },
                {
                    model: Tag,
                    as: 'tags'      // alias bạn đặt trong Product.belongsToMany
                }
            ]
        });
        res.json(products);
    } catch (error) {
        next(error); // Pass error to error handling middleware
    }
});
// GET product by ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
});
// POST create new product
router.post('/', async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
});
// PUT update product
router.put('/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const [updatedRows] = await Product.update(req.body, {
            where: { id: productId },
        });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để cập nhật' });
        }
        const updatedProduct = await Product.findByPk(productId);
        res.json(updatedProduct);
    } catch (error) {
        next(error);
    }
});
// DELETE product
router.delete('/:id', async (req, res, next) => {
    try {
        const productId = req.params.id;
        const deletedRows = await Product.destroy({
            where: { id: productId },
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }
        res.status(204).send(); // No content, delete successful
    } catch (error) {
        next(error);
    }
});
module.exports = router;