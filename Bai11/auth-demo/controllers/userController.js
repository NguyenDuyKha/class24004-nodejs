const { User } = require("../models");

const login = async (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).json({ message: "Username and password are required."});
    }

    try {
        const user = await User.scope('withPassword').findOne(
            {
                where: {
                    username: username,
                }
            }
        )
        if (!user) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        if(!(user.password === password)) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        req.session.userId = user.id;

        res.status(200).json({ message: "Login successful !"});
    } catch (err) {
        console.error("Login error: ", err);
        res.status(500).json({ message: "Server error during login" });
    }
}

const logout = (req, res) => {
    if(req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error("Error Logout:", err);
                return res.status(500).send("Could not logout.");
            }
            res.clearCookie('connect.sid');
            res.json({ message: "Logout successfully !" });
        })
    } else {
        res.json({ message: "No active session to logout" });
    }
}

const getDashboardInfo = async (req, res) => {
    res.status(200).json({
        message: "Welcome to the dashboard !",
        user: req.user
    })
}

module.exports = {
    login,
    logout,
    getDashboardInfo
}