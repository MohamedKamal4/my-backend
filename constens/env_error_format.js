const ApiError = require("../utils/api_error")

exports.error_format_dev_mode = (err , res) => {
    // dev mode تحديد شكل الايرور
    return res.status(err.statusCode).json({
        status: err.status ,
        error: err ,
        message: err.message , 
        stack: err.stack
    })
}

exports.error_format_production_mode = (err , res) => {
    // production mode تحديد شكل الايرور
    return res.status(err.statusCode).json({
        status: err.status ,
        message: err.message , 
    })
}

exports.handleJwtInvalidSignature = () => new ApiError("Invalid Token , You Must Login Again..." , 401)
exports.handleJwtTokenExpiredError = () => new ApiError("Expired Token , You Must Login Again..." , 401)