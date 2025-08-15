
const authorizeRole = (allowedRoles) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    return (req, res, next) => {
        if(!req.user || !req.user.role) {
            console.error("Authorization Error")
            return res.status(403).json({ message: "Khong the xac dinh vai tro cua nguoi dung" })
        }

        const userRole = req.user.role;
        if(!roles.includes(userRole)) {
            return res.status(403).json({ message: "Ban khong co quyen truy cap" });
        }
        next();
    };
};

module.exports = authorizeRole;