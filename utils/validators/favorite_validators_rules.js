const { body, param } = require("express-validator")

const productId = body("productId")
    .notEmpty()
    .withMessage("Product Id Is Required")
    .isMongoId()
    .withMessage("Invalid Product Id")

const favoriteProductId = param("productId")
    .notEmpty()
    .withMessage("Product Id Is Required")
    .isMongoId()
    .withMessage("Invalid Product Id")

const newProductId = body("newProductId")
    .notEmpty()
    .withMessage("New Product Id Is Required")
    .isMongoId()
    .withMessage("Invalid New Product Id")

exports.validator_add_favorite_rules = [productId]
exports.validator_update_favorite_rules = [favoriteProductId, newProductId]
exports.validator_delete_favorite_rules = [favoriteProductId]