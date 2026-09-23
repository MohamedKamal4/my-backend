const AsyncHandler = require("express-async-handler")
const userModel = require("../models/user_models")
const productsModel = require("../models/products_model")
const ApiError = require("../utils/api_error")

const getFavoriteProductId = (favorite) =>
    favorite?._id?.toString() || favorite?.toString()

const getUserFavorites = (userId) => userModel.findById(userId)

exports.getFavorites = AsyncHandler(async (req, res) => {
    const user = await getUserFavorites(req.user._id)

    res.status(200).json({
        results: user.favorites.length,
        data: user.favorites
    })
})

exports.addFavorite = AsyncHandler(async (req, res, next) => {
    const { productId } = req.body
    const product = await productsModel.findById(productId)

    if (!product) {
        return next(new ApiError(`The Product Of The ${productId} Is Not Found`, 404))
    }

    const user = await userModel.findById(req.user._id)
    if (user.favorites.some((favorite) => getFavoriteProductId(favorite) === productId)) {
        return next(new ApiError("The Product Is Already In Favorites", 400))
    }

    user.favorites.push(product.toObject())
    await user.save()

    const updatedUser = await getUserFavorites(req.user._id)
    res.status(201).json({ data: updatedUser.favorites })
})

exports.updateFavorite = AsyncHandler(async (req, res, next) => {
    const { productId } = req.params
    const { newProductId } = req.body
    const product = await productsModel.findById(newProductId)

    if (!product) {
        return next(new ApiError(`The Product Of The ${newProductId} Is Not Found`, 404))
    }

    const user = await userModel.findById(req.user._id)
    const favoriteIndex = user.favorites.findIndex(
        (favorite) => getFavoriteProductId(favorite) === productId
    )

    if (favoriteIndex === -1) {
        return next(new ApiError("Favorite product not found", 404))
    }

    if (user.favorites.some((favorite) => getFavoriteProductId(favorite) === newProductId)) {
        return next(new ApiError("The Product Is Already In Favorites", 400))
    }

    user.favorites[favoriteIndex] = product.toObject()
    await user.save()

    const updatedUser = await getUserFavorites(req.user._id)
    res.status(200).json({ data: updatedUser.favorites })
})

exports.removeFavorite = AsyncHandler(async (req, res, next) => {
    const user = await userModel.findById(req.user._id)
    const favoriteIndex = user.favorites.findIndex(
        (favorite) => getFavoriteProductId(favorite) === req.params.productId
    )

    if (favoriteIndex === -1) {
        return next(new ApiError("Favorite product not found", 404))
    }

    user.favorites.splice(favoriteIndex, 1)
    await user.save()

    res.status(204).send()
})

exports.clearFavorites = AsyncHandler(async (req, res) => {
    await userModel.findByIdAndUpdate(req.user._id, { $set: { favorites: [] } })
    res.status(204).send()
})