const { body, param } = require('express-validator');
const { Category } = require('../models');

const commonIdParamValidation = () => [
    param('id').isInt({ min: 1 }).withMessage('ID san pham la so nguyen duong')
]

const categoryExistsValidator = body('categoryId')
    .optional({ nullable: true })
    .isInt({ min: 1 }).withMessage("ID danh muc khong hop le (phai la so nguyen duong)")
    .custom(async (value) => {
        if (value) {
            const category = await Category.findByPk(value);
            if (!category) {
                throw new Error('Danh muc khong ton tai');
                // return Promise.reject('Danh muc khong ton tai');
            }
        }
        return true;
    })

const createProductValidationRules = () => {
    return [
        body('name')
            .notEmpty().withMessage("Ten san pham khong duoc de trong")
            .isLength({ min: 3, max: 255 }).withMessage("Ten san pham phai tu 3 den 255 ky tu")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 500 }).withMessage("Mo ta khong qua 500 ky tu")
            .trim(),
        body('price')
            .notEmpty().withMessage('Gia san pham khong duoc de trong')
            .isFloat({ min: 0 }).withMessage('Gia san pham phai la so khong am')
            .toFloat(),
        categoryExistsValidator
    ]
}

const updateProductValidationRules = () => {
    return [
        body('name')
            .optional()
            .isLength({ min: 3, max: 255 }).withMessage("Ten san pham phai tu 3 den 255 ky tu")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 500 }).withMessage("Mo ta khong qua 500 ky tu")
            .trim(),
        body('price')
            .optional()
            .isFloat({ min: 0 }).withMessage('Gia san pham phai la so khong am')
            .toFloat(),
        categoryExistsValidator
    ]
}

module.exports = {
    commonIdParamValidation,
    createProductValidationRules,
    updateProductValidationRules
}