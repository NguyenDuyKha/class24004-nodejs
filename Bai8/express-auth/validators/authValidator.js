const { body } = require('express-validator');

const registerValidationRules = () => {
    return [
        body('username')
            .notEmpty().withMessage('Username khong duoc de trong')
            .isLength({ min: 3, max: 30}).withMessage('Username phai tu 3 - 30 ky tu')
            .trim(),
        body('email')
            .notEmpty().withMessage('Email khong duoc de trong')
            .isEmail().withMessage('Email khong hop le')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password khong duoc de trong')
            .isLength({ min: 6}).withMessage('Password phai it nhat 6 ky tu')
    ];
}

const loginValidationRules = () => {
    return [
        body('emailOrUsername')
            .notEmpty().withMessage("Email hoac Username khong duoc de trong"),
        body('password')
            .notEmpty().withMessage('Password khong duoc de trong')
    ];
}

module.exports = {
    registerValidationRules,
    loginValidationRules
}