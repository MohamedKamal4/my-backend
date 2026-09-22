const express = require('express')
const { getProducts, createProduct, getProduct, updateProduct, deleteProduct } = require('../controlers/products_controlers')
const { handling_validation_error_middleware } = require('../middlewares/validator_middleware')
const { validator_createProduct_rules, validator_getProduct_rules, validator_updateProduct_rules, validator_deleteProduct_rules } = require('../utils/validators/products_validators_rules')
const uploadAndResizeFiles = require('../middlewares/uploadAndResizeFiles')
const uploadImages = require('../middlewares/multer_middelware')
const productsModel = require('../models/products_model')
const { deleteImageById } = require('../controlers/requests/delete_image')
const { insertImages } = require('../controlers/requests/insert_images')
const { prodect_routes, allowdTo } = require('../controlers/auth_controlers')
const { getProductReviews, createProductReviews, deleteProductReview, updateProductReview } = require('../controlers/reviews_controlers')
const { setIdFromParamToBody } = require('../middlewares/filter_data_middleware')
const router = express.Router()

router.route('/')
    .get(
        getProducts
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        uploadImages.fields([
            {
                name: "Image_Cover",
                maxCount: 1
            },
            {
                name: "Images",
                maxCount: 5
            }
        ]),
        uploadAndResizeFiles("product", 1024, 765),
        validator_createProduct_rules ,
        handling_validation_error_middleware ,
        createProduct
    )

router.route('/:id')
    .get(
        validator_getProduct_rules ,
        handling_validation_error_middleware ,
        getProduct
    )
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        validator_updateProduct_rules ,
        handling_validation_error_middleware ,
        updateProduct
    )
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        validator_deleteProduct_rules ,
        handling_validation_error_middleware ,
        deleteProduct
    )

router.route('/:id/reviews')
    .get(
        getProductReviews
    )
    .post(
        prodect_routes ,
        createProductReviews
    )

router.route('/:id/reviews/:reviewId')
    .delete(
        prodect_routes ,
        deleteProductReview
    )
    .put(
        prodect_routes ,
        updateProductReview
    )
    


// images routes    

router.route('/:id/images/:imageId')
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        deleteImageById(productsModel ,"Product" , "Images")
    )

router.route('/:id/images')
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        uploadImages.fields([
            {
                name: 'Images',
            }
        ]),
        uploadAndResizeFiles("product", 1024, 765),
        insertImages(productsModel , 'Product' , 'Images')
    )

router.route('/:id/imageCover')
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        deleteImageById(productsModel ,"Product" , 'Image_Cover')
    )
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        uploadImages.fields([
            {
                name: "Image_Cover",
                maxCount: 1            
            }
        ]),
        uploadAndResizeFiles("profile", 500, 500),
        insertImages(productsModel , 'Product' , 'Image_Cover')
    )


module.exports = router



