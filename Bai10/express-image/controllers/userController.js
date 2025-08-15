const { User } = require("../models");


exports.updateMyAvatar = async (req, res, next) => {
    // console.log("Controller: updateMyAvatar");
    // console.log("req.user", req.user);
    // console.log("req.file", req.file);

    if(!req.file || !req.file.processedFilename) {
        return res.status(400).json({ message: "Please upload an image file" });
    }

    try {
        const avatarPath = `/uploads/${req.file.processedFilename}`;
        const updateUser = await User.update(
            { avatar: avatarPath },
            { where: { id: req.user.id }}
        );
        res.status(200).json({
            message: "Avatar updated successfully!",
            data: {
                avatarUrl: avatarPath
            }
        });
    } catch (error) {
        next(error);
    }
}