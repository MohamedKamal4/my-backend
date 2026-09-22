const { check } = require("express-validator");

exports.validator_getCategory_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Category Id Not Valid Format Please Try Another One...') 
]

exports.validator_createCategory_rules = [
    check('name')
        .notEmpty()
        .withMessage('Category Name Is Required')
        .isLength({min: 3 , max: 32}).withMessage('The Category Name Must Be At least 3 chr To 32 Chr')
]

exports.validator_updateCategory_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Category Id Not Valid Format Please Try Another One...'),
    check('name')
        .notEmpty()
        .withMessage('Category Name Is Required')
        .isLength({min: 3 , max: 32}).withMessage('The Category Name Must Be At least 3 chr To 32 Chr')
]

exports.validator_deleteCategory_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Category Id Not Valid Format Please Try Another One...') 
]