const AsyncHandler = require("express-async-handler");
const userModel = require("../models/user_models");
const ApiError = require("../utils/api_error");
const { generate_token } = require("../constens/generate_token");
const jwt = require("jsonwebtoken");


exports.register = AsyncHandler( async (req , res ) => {
    const { name , email , phone , password } = req.body
    const user = await userModel.create({
        name ,
        email ,
        phone ,
        password 
    })
    
    const userId = user._id
    const token = generate_token({userId , email})
    const data = {user , token }    

    res.status(201).json(data)
})

exports.login = AsyncHandler( async (req , res , next ) => {
    const { email } = req.body
    const user = await userModel.findOne({email})

    await userModel.findByIdAndUpdate(user._id, { $unset: { logoutAt: 1 } })
   
    const userId = user._id
    const token = generate_token({userId , email})
    const data = {user , token }

    res.status(200).json(data)
})

exports.logout = AsyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(req.user._id, { logoutAt: new Date() })

    res.status(200).json({
        message: "Logged out successfully. Delete the token from the client."
    })
})


exports.prodect_routes = AsyncHandler( async (req , res , next) => {
    // 1) catch token
    const { authorization } = req.headers
    const token = authorization && authorization.match(/^Bearer\s+(.+)$/i)?.[1]

    if(!token){
        return next(new ApiError("You Are Not Login You Must Login First To You Access This Route" , 401))
    }

    // 2) verify token & refactor the errors like (Invalid token || expired token) in production mode in error_middelware file
    let decoded
    try {
        decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return next(new ApiError("Expired Token , You Must Login Again..." , 401))
        }
        return next(new ApiError("Invalid Token , You Must Login Again..." , 401))
    }

    // 3) check if user id is exisst in db or not
    const { userId } = decoded
    const user = await userModel.findById(userId)
    if(!user){
        return next(new ApiError("The User Of This Token Is Not Exisst" , 401))
    }

    //check if password changed after create token or not if changed ==> the token is not valid and return to login again
    if(user.passwordChangedAt){
        // 1) transformation user.passwordChangedAt to timestamp For comparison with decoded.iat
        const passwordTimestemp = parseInt(
            user.passwordChangedAt.getTime() / 1000 , 10
        )
        // 2) if passwordTimestemp > decoded.iat ==> changed the password after created the token is (error)
        if(passwordTimestemp > decoded.iat){
            return next(new ApiError("The User Recently Changed His Password You Must Login Again..." , 401))
        }
    }

    if(user.logoutAt){
        const logoutTimestamp = parseInt(user.logoutAt.getTime() / 1000, 10)
        if(logoutTimestamp >= decoded.iat){
            return next(new ApiError("You Are Logged Out, You Must Login Again..." , 401))
        }
    }

    req.user = user

    next()
})

exports.allowdTo = (...roles) => AsyncHandler( async (req , res , next) => {
    const userRole = req.user.role
    const isAllowd = roles.includes(userRole)

    if(!isAllowd){
        return next(new ApiError("You Cannot Access This Route" , 403))
    }

    next()
}) 