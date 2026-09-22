const express = require("express")
const { register, login } = require("../controlers/auth_controlers")
const { register_User_rules, login_user_rules } = require("../utils/validators/auth_validators_rules")
const { handling_validation_error_middleware } = require("../middlewares/validator_middleware")
const router = express.Router()

router.route("/register")
    .post(
        register_User_rules ,
        handling_validation_error_middleware ,
        register
    )

router.route("/login")
    .post(
        login_user_rules,
        handling_validation_error_middleware ,
        login
    )

module.exports = router
    