const express = require('express')
const products_releted_subCategory_routes = require('./nested_routes/products_releted_subCategory_routes')
const { createSubCategory, getSubCategories, getSubCategory, updateSubCatagory, deleteSubCategory } = require('../controlers/subCategory_controlers')
const { validator_createSubCategory_rules, validator_getSubCategory_rules, validator_updateSubCategory_rules, validator_deleteSubCategory_rules } = require('../utils/validators/subCategory_validators_rules')
const { handling_validation_error_middleware } = require('../middlewares/validator_middleware')
const { prodect_routes, allowdTo } = require('../controlers/auth_controlers')

const router = express.Router(
    {mergeParams : true} // بتديني اكسيس علي البرام الموجوده علي الراوتس الاخري لعرض بيانات بنائا عليها 
)
router.use( '/:id/products' , products_releted_subCategory_routes ) // عشان اعرض كل التصنيفات الفرعيه لتصنيف رئيسي عن طريق الاي دي الخاص بالتصنيف الرئيسي

router.route('/')
    .get(
        getSubCategories
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        validator_createSubCategory_rules ,
        handling_validation_error_middleware ,
        createSubCategory
    )

router.route('/:id')
    .get(
        validator_getSubCategory_rules ,
        handling_validation_error_middleware ,
        getSubCategory
    )
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        validator_updateSubCategory_rules ,
        handling_validation_error_middleware ,
        updateSubCatagory
    )
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        validator_deleteSubCategory_rules ,
        handling_validation_error_middleware ,
        deleteSubCategory
    )

module.exports = router