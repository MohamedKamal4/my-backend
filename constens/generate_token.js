const jwt = require("jsonwebtoken");

exports.generate_token = (payload) => {
    return jwt.sign(
        payload , //data for create uniqe token
        process.env.JWT_SECRET_KEY , // token secret key
        {expiresIn: process.env.JWT_SECRET_KEY_EX} // token ex
    )
}