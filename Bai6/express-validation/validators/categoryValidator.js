const { body } = require('express-validator');

const commonIdParamValidation = () => [
    param('id').isInt({ min: 1 }).withMessage('ID danh muc la so nguyen duong')
]

const createCategoryValidationRules = () => {
    return [
        body('name')
            .notEmpty().withMessage("Ten danh muc khong duoc de trong")
            .isLength({ min: 3, max: 255 }).withMessage("Ten danh muc phai tu 3 den 255 ky tu")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 500 }).withMessage("Mo ta khong qua 500 ky tu")
            .trim()
    ];
}

const updateCategoryValidationRules = () => {
    return [
        body('name')
            .optional()
            .isLength({ min: 3, max: 255 }).withMessage("Ten danh muc phai tu 3 den 255 ky tu")
            .trim(),
        body('description')
            .optional()
            .isLength({ max: 500 }).withMessage("Mo ta khong qua 500 ky tu")
            .trim()
    ];
}

module.exports = {
    commonIdParamValidation,
    createCategoryValidationRules,
    updateCategoryValidationRules
}