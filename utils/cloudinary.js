const { v2: cloudinary } = require("cloudinary")

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadToCloudinary = (buffer, folder) => {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }

            }
        )

        stream.end(buffer)
    })
}

const deleteFromCloudinary = (publicId) => {

    return new Promise((resolve, reject) => {

        cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image"
            },
            (error, result) => {

                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

module.exports = {
    uploadToCloudinary , 
    deleteFromCloudinary
}
