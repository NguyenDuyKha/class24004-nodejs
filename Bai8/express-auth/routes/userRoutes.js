const express = require('express');
const router = express.Router();
const { User, Profile } = require('../models');

// GET all users with their profile
router.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Profile,
                as: 'profile'
            }]
        });
        res.json(users);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
