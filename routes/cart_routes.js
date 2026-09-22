const express = require("express")
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controlers/cart_controlers")
const { prodect_routes } = require("../controlers/auth_controlers")
const { handling_validation_error_middleware } = require("../middlewares/validator_middleware")
const {
    validator_add_cart_item_rules,
    validator_update_cart_item_rules,
    validator_delete_cart_item_rules
} = require("../utils/validators/cart_validators_rules")

const router = express.Router()

router.use(prodect_routes)

router.route("/")
    .get(
        prodect_routes ,
        getCart
    )
    .post(
        prodect_routes ,
        validator_add_cart_item_rules,
        handling_validation_error_middleware,
        addToCart
    )
    .delete(
        prodect_routes ,
        clearCart
    )

router.route("/:productId/:size")
    .put(
        prodect_routes ,
        validator_update_cart_item_rules,
        handling_validation_error_middleware,
        updateCartItem
    )
    .delete(
        prodect_routes ,
        validator_delete_cart_item_rules,
        handling_validation_error_middleware,
        removeFromCart
    )

module.exports = router