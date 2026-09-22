const sharp = require("sharp")
const { uploadToCloudinary } = require("../utils/cloudinary")

function uploadAndResizeFiles(folder, w, h) {

    return async (req, res, next) => {

        try {

            if (!req.files || Object.keys(req.files).length === 0) {
                return next()
            }

            const result = {}

            for (const fieldName in req.files) {

                const fieldFiles = req.files[fieldName]

                const uploaded = await Promise.all(
                    fieldFiles.map(async (file) => {

                        const buffer = await sharp(file.buffer)
                            .resize(w, h)
                            .webp({ quality: 80 })
                            .toBuffer()

                        const image = await uploadToCloudinary(
                            buffer,
                            `${folder}/${fieldName}`
                        )

                        return {
                            secure_url: image.secure_url,
                            public_id: image.public_id
                        }
                    })
                )

                if (fieldFiles.length === 1) {
                    result[fieldName] = uploaded[0]
                } else {
                    result[fieldName] = uploaded
                }
            }

            req.body = {
                ...(req.body || {}),
                ...result
            }

            next()

        } catch (error) {
            next(error)
        }
    }
}

module.exports = uploadAndResizeFiles