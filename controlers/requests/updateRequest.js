const AsyncHandler = require("express-async-handler")
const ApiError = require("../../utils/api_error")
const slugify = require("slugify") 

function Update(model , title){
    return AsyncHandler(async (req , res , next) => {
        const { id } = req.params
        const body = title === "User" ? (({ password, ...rest }) => rest)(req.body) : req.body
        
        if(body?.name) body.slug = slugify(body.name)

        const data = await model.findOneAndUpdate( 
            {_id: id},
            body , 
            { 
                new: true ,
                runValidators: true 
            } 
        )
        if(!data){ 
            return next(new ApiError(`This ${title} Of The ${id} Was Not Found` , 404)) 
        }
        res.status(200).json({data : data})
    })
}

module.exports = Update