const multer = require("multer")

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
        cb(null, true)
    } else {
        cb(new Error("Only Images Are Allowed"), false)
    }
}

const uploadImages = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})

module.exports = uploadImages
