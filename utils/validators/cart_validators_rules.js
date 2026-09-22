const { body, param } = require("express-validator")

const productId = body("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format")

const quantity = body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be an integer greater than 0")

const size = body("size")
    .trim()
    .notEmpty()
    .withMessage("Size is required")

const cartSize = param("size")
    .trim()
    .notEmpty()
    .withMessage("Size is required")

const cartProductId = param("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format")

exports.validator_add_cart_item_rules = [productId, quantity, size]
exports.validator_update_cart_item_rules = [cartProductId, cartSize, quantity]
exports.validator_delete_cart_item_rules = [cartProductId, cartSize]