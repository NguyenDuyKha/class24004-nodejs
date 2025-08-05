const { Category, Product } = require('../models');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({
            include: [{
                model: Product, // Model cần include (Product)
                as: 'products'  // Alias đã define trong Category.hasMany (optional)
            }]
        });
        res.json(categories);
    } catch (error) {
        next(error);
    }
}

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await Category.findByPk(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
}

exports.createCategory = async (req, res, next) => {
    try {
        const newCategory = await Category.create(req.body);
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                errors: [{
                    msg: "Ten danh muc da ton tai",
                    param: 'name',
                    location: 'body'
                }]
            })
        }
        next(error);
    }
}

exports.updateCategory = async (req, res, next) => {
    try {
        const [updatedRows] = await Category.update(req.body, {
            where: { id: req.params.id },
        });
        if (updatedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục để cập nhật' });
        }
        const updatedCategory = await Category.findByPk(req.params.id);
        res.json(updatedCategory);
    } catch (error) {
        next(error);
    }
}

exports.deleteCategory = async (req, res, next) => {
    try {
        const deletedRows = await Category.destroy({
            where: { id: req.params.id },
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
        }
        res.status(204).send(); // No content, delete successful
    } catch (error) {
        next(error);
    }
}
