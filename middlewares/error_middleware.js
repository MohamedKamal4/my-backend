const { error_format_dev_mode, error_format_production_mode, handleJwtInvalidSignature, handleJwtTokenExpiredError } = require("../constens/env_error_format")

// Global Error Handling Meddleware Using Express
exports.global_error_handling = ( err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    if(process.env.NODE_ENV === 'development'){
        error_format_dev_mode(err , res)
    }else{
        if(err.name === "JsonWebTokenError") err = handleJwtInvalidSignature()
        if(err.name === "TokenExpiredError") err = handleJwtTokenExpiredError()
        error_format_production_mode(err , res)
    }
}
