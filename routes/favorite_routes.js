const express = require("express")
const {
    getFavorites,
    addFavorite,
    updateFavorite,
    removeFavorite,
    clearFavorites
} = require("../controlers/favorite_controlers")
const { prodect_routes, allowdTo } = require("../controlers/auth_controlers")
const { handling_validation_error_middleware } = require("../middlewares/validator_middleware")
const {
    validator_add_favorite_rules,
    validator_update_favorite_rules,
    validator_delete_favorite_rules
} = require("../utils/validators/favorite_validators_rules")

const router = express.Router()

router.use(prodect_routes)

router.route("/")
    .get(
        prodect_routes ,
        allowdTo("user") ,
        getFavorites
    )
    .post(
        prodect_routes ,
        allowdTo("user") ,
        validator_add_favorite_rules,
        handling_validation_error_middleware,
        addFavorite
    )
    .delete(clearFavorites)

router.route("/:productId")
    .put(
        prodect_routes ,
        allowdTo("user") ,
        validator_update_favorite_rules,
        handling_validation_error_middleware,
        updateFavorite
    )
    .delete(
        prodect_routes ,
        allowdTo("user") ,
        validator_delete_favorite_rules,
        handling_validation_error_middleware,
        removeFavorite
    )

module.exports = router