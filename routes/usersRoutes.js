const express = require("express")
const { getUsers, createUser, GetSpecificUser, updateUser, deleteUser, updatePasswordUser } = require("../controlers/user_controlers")
const { validator_create_User_rules, validator_get_User_rules, validator_update_User_rules, validator_delete_User_rules, validator_update_User_password_rules } = require("../utils/validators/users_validators_rules")
const { handling_validation_error_middleware } = require("../middlewares/validator_middleware")
const uploadAndResizeFiles = require("../middlewares/uploadAndResizeFiles")
const uploadImages = require("../middlewares/multer_middelware")
const userModel = require("../models/user_models")
const { deleteImageById } = require("../controlers/requests/delete_image")
const { insertImages } = require("../controlers/requests/insert_images")
const { prodect_routes, allowdTo } = require("../controlers/auth_controlers")
const cart_routes = require("./cart_routes")
const order_routes = require("./order_routes")
const router = express.Router()

router.use("/me/cart", cart_routes)
router.use("/me/orders", order_routes)

router.route('/')
    .get(
        prodect_routes ,
        allowdTo("admin") ,
        getUsers
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        uploadImages.fields([
            {
                name: "profile",
                maxCount: 1
            }
        ]),
        uploadAndResizeFiles("User", 500, 500) ,
        validator_create_User_rules ,
        handling_validation_error_middleware , 
        createUser
    )

router.route('/:id')
    .get(
        prodect_routes ,
        validator_get_User_rules ,
        handling_validation_error_middleware ,
        GetSpecificUser
    )
    .put(
        prodect_routes ,
        validator_update_User_rules ,
        handling_validation_error_middleware ,
        updateUser
    )
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        validator_delete_User_rules ,
        handling_validation_error_middleware ,
        deleteUser
    )

router.route('/:id/profile')
    .delete(
        prodect_routes ,
        deleteImageById(userModel ,"User" , 'profile')
    )
    .put(
        prodect_routes ,
        uploadImages.fields([
            {
                name: "profile",
                maxCount: 1
            }
        ]),
        uploadAndResizeFiles("User", 500, 500) ,
        insertImages(userModel , 'User' , 'profile')
    )


router.route("/changePassword/:id")
    .put(
        prodect_routes ,
        validator_update_User_password_rules ,
        handling_validation_error_middleware ,
        updatePasswordUser
    )

module.exports = router
