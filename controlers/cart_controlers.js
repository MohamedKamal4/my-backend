const AsyncHandler = require("express-async-handler")
const userModel = require("../models/user_models")
const productsModel = require("../models/products_model")
const ApiError = require("../utils/api_error")

const getUserCart = (userId) => userModel.findById(userId).populate("cart.product")

exports.getCart = AsyncHandler(async (req, res) => {
    const user = await getUserCart(req.user._id)
    console.log("getCart" , req.user)
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
        item.product.toString() === productId && item.size === size
    )

    if (cartItem) {
        cartItem.quantity += quantity
    } else {
        user.cart.push({ product: productId, quantity, size })
    }

    await user.save()

    const updatedUser = await getUserCart(req.user._id)
    res.status(201).json({ data: updatedUser.cart })
})

exports.updateCartItem = AsyncHandler(async (req, res, next) => {
    const { productId, size } = req.params
    const { quantity } = req.body
    const user = await userModel.findOneAndUpdate(
        { _id: req.user._id, cart: { $elemMatch: { product: productId, size } } },
        { $set: { "cart.$[item].quantity": quantity } },
        { arrayFilters: [{ "item.product": productId, "item.size": size }], new: true, runValidators: true }
    )

    if (!user) {
        return next(new ApiError("Cart item not found", 404))
    }

    const updatedUser = await getUserCart(req.user._id)
    res.status(200).json({ data: updatedUser.cart })
})

exports.removeFromCart = AsyncHandler(async (req, res, next) => {
    const { productId, size } = req.params
    const user = await userModel.findOneAndUpdate(
        { _id: req.user._id, cart: { $elemMatch: { product: productId, size } } },
        { $pull: { cart: { product: productId, size } } },
        { new: true }
    )

    console.log(user)

    if (!user) {
        return next(new ApiError("Cart item not found", 404))
    }

    res.status(204).send()
})

exports.clearCart = AsyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(req.user._id, { $set: { cart: [] } })
    res.status(204).send()
})
