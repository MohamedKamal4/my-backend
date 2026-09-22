const expressAsyncHandler = require("express-async-handler")
const ApiError = require("../../utils/api_error")
const { deleteFromCloudinary } = require("../../utils/cloudinary")

exports.deleteImageById = (model, title, field) => {
    return expressAsyncHandler(async (req, res, next) => {

        const { id, imageId } = req.params

        const data = await model.findById(id)

        if (!data) {
            return next(
                new ApiError(
                    `Can't Find The ${title} Of This Id ${id}`,
                    404
                )
            )
        }

        let image

        if (field === "Images") {

            image = data.Images.id(imageId)

            if (!image) {
                return next(
                    new ApiError(`${title} Image Not Found`, 404)
                )
            }

            await deleteFromCloudinary(image.public_id)

            image.deleteOne()
        }

        else {

            image = data[field]

            if (!image || !image.public_id) {
                return next(
                    new ApiError(`${title} ${field} Not Found`, 404)
                )
            }

            await deleteFromCloudinary(image.public_id)

            data[field] = {}
        }

        await data.save()

        res.status(200).json({
            message: `${title} Image Deleted Successfully`,
            data
        })
    })
}