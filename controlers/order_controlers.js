const AsyncHandler = require("express-async-handler")
const userModel = require("../models/user_models")
const ApiError = require("../utils/api_error")

exports.createOrder = AsyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    if (!user || user.cart.length === 0) {
        return next(new ApiError("Cannot create an order from an empty cart", 400))
    }

    console.log("createOrder" , req.user)

    const orderItems = user.cart.map((item) => ({
        product: item.product,
        size: item.size,
        quantity: item.quantity
    }))

    user.orders.push({ items: orderItems })
    user.cart = []
    await user.save()

    await user.populate("orders.items.product")
    const order = user.orders[user.orders.length - 1]

    res.status(201).json({ data: order })
})
