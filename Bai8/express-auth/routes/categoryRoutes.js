const express = require('express');
const router = express.Router();
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const { commonIdParamValidation, createCategoryValidationRules, updateCategoryValidationRules } = require('../validators/categoryValidator');
const { getAllCategories, getCategoryById, updateCategory, createCategory, deleteCategory } = require('../controllers/categoryController');

// GET all categories
router.get('/', getAllCategories);
// GET category by ID
router.get('/:id',
    commonIdParamValidation(),
    getCategoryById);
// POST create new category
router.post('/',
    createCategoryValidationRules(),
    handleValidationErrors,
    createCategory);
// PUT update category
router.put('/:id',
    updateCategoryValidationRules(),
    handleValidationErrors,
    updateCategory);
// DELETE category
router.delete('/:id',
    commonIdParamValidation(),
    deleteCategory);
module.exports = router;