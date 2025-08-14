const express = require('express');
const router = express.Router();
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const { commonIdParamValidation, createCategoryValidationRules, updateCategoryValidationRules } = require('../validators/categoryValidator');
const { getAllCategories, getCategoryById, updateCategory, createCategory, deleteCategory } = require('../controllers/categoryController');
const authenticationToken = require('../middlewares/authenticationToken');
const authorizeRole = require('../middlewares/authorizeRole');

// GET all categories
router.get('/',
    authenticationToken,
    authorizeRole('admin'),
    getAllCategories);
// GET category by ID
router.get('/:id',
    authenticationToken,
    authorizeRole('admin'),
    commonIdParamValidation(),
    getCategoryById);
// POST create new category
router.post('/',
    authenticationToken,
    authorizeRole('admin'),
    createCategoryValidationRules(),
    handleValidationErrors,
    createCategory);
// PUT update category
router.put('/:id',
    authenticationToken,
    authorizeRole('admin'),
    updateCategoryValidationRules(),
    handleValidationErrors,
    updateCategory);
// DELETE category
router.delete('/:id',
    authenticationToken,
    authorizeRole('admin'),
    commonIdParamValidation(),
    deleteCategory);
module.exports = router;