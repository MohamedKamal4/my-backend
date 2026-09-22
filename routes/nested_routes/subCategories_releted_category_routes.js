const express = require('express')
const router = express.Router(
    {mergeParams : true} // بتديني اكسيس علي البرام الموجوده علي الراوتس الاخري لعرض بيانات بنائا عليها 
)
const { createFilterObject , setIdFromParamToBody } = require('../../middlewares/filter_data_middleware')
const { handling_validation_error_middleware } = require('../../middlewares/validator_middleware')
const { getSubCategories, createSubCategory } = require('../../controlers/subCategory_controlers')
const { validator_createSubCategory_rules } = require('../../utils/validators/subCategory_validators_rules')
const { prodect_routes, allowdTo } = require('../../controlers/auth_controlers')


router.route('/')
    .get(
        prodect_routes ,
        createFilterObject({title : "parent_category"}) ,
        getSubCategories
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        setIdFromParamToBody({title: 'parent_category'}) ,
        validator_createSubCategory_rules ,
        handling_validation_error_middleware ,
        createSubCategory
    )

module.exports = router
