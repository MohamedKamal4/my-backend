const express = require("express")
const { prodect_routes, allowdTo } = require("../controlers/auth_controlers")
const { createOrder } = require("../controlers/order_controlers")

const router = express.Router()

router.route("/")
    .post(
        prodect_routes ,
        allowdTo("user") ,
        createOrder
    )
module.exports = router
