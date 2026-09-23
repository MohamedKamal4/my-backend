const AsyncHandler = require("express-async-handler")
const userModel = require("../models/user_models")
const productsModel = require("../models/products_model")
const ApiError = require("../utils/api_error")

const getProductId = (product) => product?._id?.toString() || product?.toString()

const getUserCart = (userId) => userModel.findById(userId)

exports.getCart = AsyncHandler(async (req, res) => {
    const user = await getUserCart(req.user._id)
    res.status(200).json({
        results: user.cart.length,
        data: user.cart
    })
})

exports.addToCart = AsyncHandler(async (req, res, next) => {
    const { productId, quantity , size } = req.body
    const product = await productsModel.findById(productId)

    if (!product) {
        return next(new ApiError(`The Product Of The ${productId} Is Not Found`, 404))
    }

    const user = await userModel.findById(req.user._id)
    const cartItem = user.cart.find((item) =>
        getProductId(item.product) === productId && item.size === size
    )

    if (cartItem) {
        cartItem.product = product.toObject()
        cartItem.quantity += quantity
    } else {
        user.cart.push({ product: product.toObject(), quantity, size })
    }

    await user.save()

    const updatedUser = await getUserCart(req.user._id)
    res.status(201).json({ data: updatedUser.cart })
})

exports.updateCartItem = AsyncHandler(async (req, res, next) => {
    const { productId, size } = req.params
    const { quantity } = req.body
    const user = await userModel.findById(req.user._id)
    const cartItem = user.cart.find((item) =>
        getProductId(item.product) === productId && item.size === size
    )

    if (!cartItem) {
        return next(new ApiError("Cart item not found", 404))
    }

    cartItem.quantity = quantity
    await user.save()

    const updatedUser = await getUserCart(req.user._id)
    res.status(200).json({ data: updatedUser.cart })
})

exports.removeFromCart = AsyncHandler(async (req, res, next) => {
    const { productId, size } = req.params
    const user = await userModel.findById(req.user._id)
    const cartItemIndex = user.cart.findIndex((item) =>
        getProductId(item.product) === productId && item.size === size
    )

    if (cartItemIndex === -1) {
        return next(new ApiError("Cart item not found", 404))
    }

    user.cart.splice(cartItemIndex, 1)
    await user.save()
    res.status(204).send()
})

exports.clearCart = AsyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(req.user._id, { $set: { cart: [] } })
    res.status(204).send()
})
