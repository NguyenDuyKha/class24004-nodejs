const express = require('express');
const router = express.Router();
const { User, Profile } = require('../models');
const authenticationToken = require('../middlewares/authenticationToken');
const { uploadSingleImage } = require('../middlewares/uploadMiddleware');
const { updateMyAvatar } = require('../controllers/userController');
const { resizeImage } = require('../middlewares/imageProcessingMiddleware');

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

router.patch('/update-my-avatar',
    authenticationToken,
    uploadSingleImage('avatar'),
    resizeImage,
    updateMyAvatar
)

module.exports = router;
