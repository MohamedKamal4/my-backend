const { check } = require("express-validator");
const categoryModel = require("../../models/category_model");

exports.validator_getBrand_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Brand Id Not Valid Format Please Try Another One...') 
]

exports.validator_createBrand_rules = [
    check('name')
        .notEmpty()
        .withMessage('Brand Name Is Required')
        .isLength({min: 2 , max: 32}).withMessage('The Brand Name Must Be At least 2 chr To 32 Chr'),
]

exports.validator_updateBrand_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Brand Id Not Valid Format Please Try Another One...'),
    check('name')
        .optional()
        .isLength({min: 2 , max: 32}).withMessage('The Brand Name Must Be At least 2 chr To 32 Chr'),
    check('category')
        .optional()
        .isMongoId()
        .withMessage('Invalid Id Format')
        .custom((id) => categoryModel.findById(id).then((category) => {
            if(!category){
                throw new Error(`Cannot Find This Category`)
            }
        }))
]

exports.validator_deleteBrand_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Brand Id Not Valid Format Please Try Another One...') 
]