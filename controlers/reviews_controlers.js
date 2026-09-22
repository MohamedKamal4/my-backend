const AsyncHandler = require("express-async-handler");
const productsModel = require("../models/products_model");
const ApiError = require("../utils/api_error");

exports.getProductReviews = AsyncHandler(async (req , res , next) => {
    const { id } = req.params
    const page = 1
    const product = await productsModel.findById(id)

    if(!product){
        return next(new ApiError(`The Product Of The ${id} Is Not Find` , 404))
    }

    res.status(200).json({
        results : product.reviews.length ,
        page ,
        data: product.reviews
    })
})

exports.createProductReviews = AsyncHandler(async (req, res, next) => {
    req.body.user = req.user._id;
    const { id } = req.params;
    const product = await productsModel.findByIdAndUpdate(
        id,
        {
            $push: {
                reviews: req.body
            }
        },
        {
            new: true
        }
    )

    if (!product) {
        return next(
            new ApiError(`The Product Of The ${id} Is Not Found`, 404)
        );
    }

    res.status(201).json({
        results: product.reviews.length,
        data: product.reviews
    });
});

exports.deleteProductReview = AsyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;

    const product = await productsModel.findOneAndUpdate(
        { _id: id, reviews: { $elemMatch: { _id: reviewId, user: req.user._id } } },
        { $pull: { reviews: { _id: reviewId } } },
        { new: true }
    );

    if (!product) { 
        return next(new ApiError( "Product or Review not found, or you don't have access", 404 )) 
    }

    res.status(204).send();
});

exports.updateProductReview = AsyncHandler(async (req, res, next) => {
    const { id, reviewId } = req.params;

    const product = await productsModel.findById(id);

    if (!product) {
        return next(
            new ApiError(`The Product Of The ${id} Is Not Found`, 404)
        );
    }

    const review = product.reviews.find(
        (review) => review._id.toString() === reviewId
    );

    if (!review) {
        return next(
            new ApiError(`Review Of The ${reviewId} Is Not Found`, 404)
        );
    }

    if (review.user.toString() !== req.user._id.toString()) {
        return next(
            new ApiError("You Don't Have Access For This Action", 403)
        );
    }

    review.rating = req.body.rating ?? review.rating;
    review.comment = req.body.comment ?? review.comment;

    await product.save();

    res.status(200).json({
        data: review
    });
});