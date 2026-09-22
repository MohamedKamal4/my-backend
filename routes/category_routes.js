const express = require('express')
const router = express.Router()
const subCategories_releted_category_routes = require('./nested_routes/subCategories_releted_category_routes')
const products_releted_Category_routes = require('./nested_routes/products_releted_category_routes')
const { getCategories, createCategory , getCategory , updateCatagory, deleteCategory } = require('../controlers/category_controlers')
const { handling_validation_error_middleware } = require('../middlewares/validator_middleware')
const { validator_getCategory_rules, validator_createCategory_rules, validator_updateCategory_rules, validator_deleteCategory_rules } = require('../utils/validators/category_validators_rules')
const { prodect_routes, allowdTo } = require('../controlers/auth_controlers')

router.use('/:id/subCategories' , subCategories_releted_category_routes) // عشان اعرض كل التصنيفات الفرعيه لتصنيف رئيسي عن طريق الاي دي الخاص بالتصنيف الرئيسي
router.use( '/:id/products' , products_releted_Category_routes ) // عشان اعرض كل التصنيفات الفرعيه لتصنيف رئيسي عن طريق الاي دي الخاص بالتصنيف الرئيسي

router.route('/')
    .get(
        getCategories
    )
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        validator_createCategory_rules ,
        handling_validation_error_middleware ,
        createCategory
    )

router.route('/:id')
    .get(
        validator_getCategory_rules, // rules
        handling_validation_error_middleware, // The Validtion Layer For Catch Errors From Rules Http Request Is Exist
        getCategory
    )
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        validator_updateCategory_rules,
        handling_validation_error_middleware,
        updateCatagory
    )
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        validator_deleteCategory_rules,
        handling_validation_error_middleware,
        deleteCategory
    )




module.exports = router