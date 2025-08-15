const express = require('express');
const router = express.Router();
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const { createProductValidationRules, commonIdParamValidation, updateProductValidationRules } = require('../validators/productValidator');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

const authenticationToken = require('../middlewares/authenticationToken');
const authorizeRole = require('../middlewares/authorizeRole');

// GET all products
router.get('/', getAllProducts);
// GET product by ID
router.get('/:id',
    commonIdParamValidation(),
    handleValidationErrors,
    getProductById);
// POST create new product
router.post('/',
    authenticationToken,
    createProductValidationRules(),
    handleValidationErrors,
    createProduct);
// PUT update product
router.put('/:id',
    authenticationToken,
    updateProductValidationRules(),
    updateProduct);
// DELETE product
router.delete('/:id',
    authenticationToken,
    authorizeRole('admin'),
    commonIdParamValidation(),
    deleteProduct);
module.exports = router;