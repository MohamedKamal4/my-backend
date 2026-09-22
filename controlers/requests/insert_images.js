const expressAsyncHandler = require("express-async-handler")
const ApiError = require("../../utils/api_error")

exports.insertImages = (model, title, field) => {

    return expressAsyncHandler(async (req, res, next) => {

        const { id } = req.params

        const data = await model.findById(id)

        if (!data) {
            return next(
                new ApiError(
                    `Can't Find The ${title} Of This Id ${id}`,
                    404
                )
            )
        }

        const uploadedFiles = req.body[field]

        if (!uploadedFiles) {
            return next(
                new ApiError(
                    `${title} ${field} Is Required`,
                    400
                )
            )
        }

        if (field === "Images") {

            if (!Array.isArray(uploadedFiles)) {
                return next(
                    new ApiError(
                        `${field} Must Be An Array`,
                        400
                    )
                )
            }

            data[field].push(...uploadedFiles)

        } 
        
        else {

            if (Array.isArray(uploadedFiles)) {
                return next(
                    new ApiError(
                        `${field} Must Be An Object`,
                        400
                    )
                )
            }

            data[field] = uploadedFiles
        }

        await data.save()

        res.status(200).json({
            message: `${title} ${field} Added Successfully`,
            data
        })
    })
}