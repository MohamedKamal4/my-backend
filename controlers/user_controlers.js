const AsyncHandler = require("express-async-handler");
const userModel = require("../models/user_models");
const Create = require("./requests/createItem");
const Delete = require("./requests/deleteRequest");
const GetItems = require("./requests/getItems");
const GetSpecificItem = require("./requests/getSpecificItem");
const Update = require("./requests/updateRequest");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/api_error");

//----------------------------------
exports.getUsers = GetItems(userModel)
//----------------------------------
exports.createUser = Create(userModel)
//----------------------------------
exports.GetSpecificUser = GetSpecificItem(userModel , "User")
//----------------------------------
exports.updateUser = Update(userModel , 'User')
//----------------------------------
exports.updatePasswordUser = AsyncHandler(async (req , res , next) => {
    const { id } = req.params
    const data = await userModel.findOneAndUpdate( 
        {_id: id},
        {
            password: await bcrypt.hash(req.body.password , 12),
            passwordChangedAt: Date.now()
        },
        { 
            new: true ,
            runValidators: true 
        } 
    )
    if(!data){ 
        return next(new ApiError(`This User Of The ${id} Was Not Found` , 404)) 
    }
    res.status(200).json({data : data})
})
//----------------------------------
exports.deleteUser = Delete(userModel , 'User')
//----------------------------------