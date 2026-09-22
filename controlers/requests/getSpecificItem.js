const AsyncHandler = require("express-async-handler")
const ApiError = require("../../utils/api_error")

function GetSpecificItem(model , title){
    return AsyncHandler(async (req , res , next) => {
        const { id } = req.params
        const data = await model.findById(id)
        if(!data){
            return next(new ApiError(`This ${title} Of The ${id} Was Not Found` , 404))
        }
        res.status(200).json({data: data})
    })
}

module.exports = GetSpecificItem