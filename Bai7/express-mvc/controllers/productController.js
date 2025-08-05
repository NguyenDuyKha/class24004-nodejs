const { Product, Category, Tag } = require('../models');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({
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
}

exports.getProductById = async (req, res, next) => {
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
}

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
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
}

exports.deleteProduct = async (req, res, next) => {
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
}