const sharp = require("sharp");
const path = require("path");
const fs = require('fs');

exports.resizeImage = async (req, res, next) => {
    if(!req.file) {
        return next();
    }

    const tempFilePath = req.file.path;
    try {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9); // 16700000000-123456789
        const ext = '.jpeg';
        const finalFilename = `image-${uniqueSuffix}${ext}`;

        req.file.processedFilename = finalFilename;

        const finalDirectory = path.join(__dirname, "..", "public", "uploads");
        const finalFilePath = path.join(finalDirectory, finalFilename);

        await sharp(tempFilePath)
            .resize(1000) // Chieu rong = 1000px
            .toFormat("jpeg") // convert jpeg
            .jpeg({ quality: 80 }) // 1-100
            .toFile(finalFilePath);

        fs.unlink(tempFilePath, (err) => {
            if(err) {
                console.error("Loi khi xoa file tam:", tempFilePath, err);
            } else {
                console.log("Da xoa file tam:", tempFilePath);
            }
        })
        next();
    } catch (error) {
        console.error("Loi khi xu ly anh:", error);

        fs.unlink(tempFilePath, (err) => {
            if(err) {
                console.error("Loi khi xoa file tam:", tempFilePath, err);
            } else {
                console.log("Da xoa file tam:", tempFilePath);
            }
        })
        next(error);
    }
}