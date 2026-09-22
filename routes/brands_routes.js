const express = require('express')
const products_releted_brand_routes = require('./nested_routes/products_releted_brand_routes')
const { getBrands, createBrand, getBrandById, updateBrandById, deleteBrandById } = require("../controlers/brands_controlers");
const { handling_validation_error_middleware } = require('../middlewares/validator_middleware');
const { validator_createBrand_rules, validator_getBrand_rules, validator_updateBrand_rules, validator_deleteBrand_rules } = require('../utils/validators/brands_validators_rules');
const { prodect_routes, allowdTo } = require('../controlers/auth_controlers');

const router = express.Router(
    {mergeParams : true} // بتديني اكسيس علي البرام الموجوده علي الراوتس الاخري لعرض بيانات بنائا عليها 
)
router.use('/:id/products' , products_releted_brand_routes) // عشان اعرض كل التصنيفات الفرعيه لتصنيف رئيسي عن طريق الاي دي الخاص بالتصنيف الرئيسي

router.route('/')
    .get(getBrands)
    .post(
        prodect_routes ,
        allowdTo("admin") ,
        validator_createBrand_rules ,
        handling_validation_error_middleware ,
        createBrand
    )

router.route('/:id')
    .get(
        validator_getBrand_rules ,
        handling_validation_error_middleware ,
        getBrandById
    )
    .put(
        prodect_routes ,
        allowdTo("admin") ,
        validator_updateBrand_rules ,
        handling_validation_error_middleware ,
        updateBrandById
    )
    .delete(
        prodect_routes ,
        allowdTo("admin") ,
        validator_deleteBrand_rules , 
        handling_validation_error_middleware ,
        deleteBrandById
    )


module.exports = router