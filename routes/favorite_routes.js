const express = require("express")
const {
    getFavorites,
    addFavorite,
    updateFavorite,
    removeFavorite,
    clearFavorites
} = require("../controlers/favorite_controlers")
const { prodect_routes } = require("../controlers/auth_controlers")
const { handling_validation_error_middleware } = require("../middlewares/validator_middleware")
const {
    validator_add_favorite_rules,
    validator_update_favorite_rules,
    validator_delete_favorite_rules
} = require("../utils/validators/favorite_validators_rules")

const router = express.Router()

router.use(prodect_routes)

router.route("/")
    .get(getFavorites)
    .post(
        validator_add_favorite_rules,
        handling_validation_error_middleware,
        addFavorite
    )
    .delete(clearFavorites)

router.route("/:productId")
    .put(
        validator_update_favorite_rules,
        handling_validation_error_middleware,
        updateFavorite
    )
    .delete(
        validator_delete_favorite_rules,
        handling_validation_error_middleware,
        removeFavorite
    )

module.exports = router