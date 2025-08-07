const express = require('express');
const router = express.Router();
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const { register, login } = require('../controllers/authController');

router.post('/register',
    registerValidationRules(),
    handleValidationErrors,
    register);

router.post('/login',
    loginValidationRules(),
    handleValidationErrors,
    login);

module.exports = router;