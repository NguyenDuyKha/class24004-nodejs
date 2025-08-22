const { User } = require("../models");

const authenticate = async (req, res, next) => {
    if(req.session && req.session.userId) {
        try {
            const user = await User.findByPk(req.session.userId);

            if(!user) {
                req.session.destroy(err => {
                    if (err) {
                        console.error("Error destroying invalid session:", err);
                    }
                    res.status(401).json({ message: "Unauthorized: Invalid session. Please login again" });
                })
            } else {
                req.user = user;
                next();
            }
        } catch (error) {
            console.error("Server error during authentication", error);
            res.status(500).json({ message: "Server error during authentication" });
        }
    } else {
        res.status(401).json({ message: "Unauthorized: Please login" });
    }
}

module.exports = {
    authenticate
}