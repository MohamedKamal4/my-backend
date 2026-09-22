const AsyncHandler = require("express-async-handler")
const ApiError = require("../../utils/api_error")

function Delete(model , title){
    return AsyncHandler(async (req , res , next) => {
        let data = null 
        const { id } = req.params
        if(title === "User"){
            data = await model.findOneAndUpdate( 
                {_id: id},
                req.body , 
                { 
                    new: true ,
                    runValidators: true 
                } 
            )
        }else{
            data = await model.findByIdAndDelete(id)
        }

        if(!data){
            return next(new ApiError(`This ${title} Of The ${id} Was Not Found` , 404))
        }
        res.status(204).send()
    })
}

module.exports = Delete