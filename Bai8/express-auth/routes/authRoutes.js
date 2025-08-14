const express = require('express');
const router = express.Router();
const { registerValidationRules, loginValidationRules } = require('../validators/authValidator');
const handleValidationErrors = require('../middlewares/validationErrorHandler');
const { register, login, getMe } = require('../controllers/authController');
const authenticationToken = require('../middlewares/authenticationToken');

router.post('/register',
    registerValidationRules(),
    handleValidationErrors,
    register);

router.post('/login',
    loginValidationRules(),
    handleValidationErrors,
    login);

router.get('/me',
    authenticationToken,
    getMe);
module.exports = router;