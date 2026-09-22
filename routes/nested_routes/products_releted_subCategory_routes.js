const express = require('express')
const router = express.Router(
    {mergeParams : true} // بتديني اكسيس علي البرام الموجوده علي الراوتس الاخري لعرض بيانات بنائا عليها 
)
const { createFilterObject , setIdFromParamToBody } = require('../../middlewares/filter_data_middleware')
const { getProducts, createProduct } = require('../../controlers/products_controlers')
const { validator_createProduct_rules } = require('../../utils/validators/products_validators_rules')
const { handling_validation_error_middleware } = require('../../middlewares/validator_middleware')
const { allowdTo, prodect_routes } = require('../../controlers/auth_controlers')


router.route('/')
    .get(
        prodect_routes ,
        createFilterObject({title : "sub_category"}) ,
        getProducts
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        setIdFromParamToBody({title: 'sub_category'}) ,
        validator_createProduct_rules ,
        handling_validation_error_middleware ,
        createProduct
    )

module.exports = router
