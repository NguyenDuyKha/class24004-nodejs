const express = require('express');
const router = express.Router();

const { authenticate } = require("../middlewares/authMiddleware");
const { login, logout, getDashboardInfo } = require("../controllers/userController");

router.post("/login", login);
router.get('/logout', logout);
router.get('/dashboard', authenticate, getDashboardInfo);

module.exports = router;

