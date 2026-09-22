const { check } = require("express-validator");
const categoryModel = require("../../models/category_model");

exports.validator_getSubCategory_rules = [
    check('id').isMongoId().withMessage('The Sub Category Id Not Valid Format Please Try Another One...') 
]

exports.validator_createSubCategory_rules = [
    check('name')
        .notEmpty()
        .withMessage('Sub Category Name Is Required')
        .isLength({min: 2 , max: 32})
        .withMessage('The Sub Category Name Must Be At least 3 chr To 32 Chr'),
    check('parent_category')
        .notEmpty()
        .withMessage('The Sub Category Must Be Belong To Parent Category')
        .isMongoId()
        .withMessage('The Category Id Not Valid Format')
        .custom((id) => categoryModel.findById(id).then((category) => {
            if(!category){
                throw new Error(`Cannot Find This Category`)
            }
        }))
]

exports.validator_updateSubCategory_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Sub Category Id Not Valid Format Please Try Another One...'),
    check('name')
        .optional()
        .isLength({min: 3 , max: 32})
        .withMessage('The Sub Category Name Must Be At least 3 chr To 32 Chr'),
    check('parent_category')
        .optional()
        .isMongoId()
        .withMessage('The Category Id Not Valid Format')
        .custom((id) => categoryModel.findById(id).then((category) => {
            if(!category){
                throw new Error(`Cannot Find This Category`)
            }
        }))
]

exports.validator_deleteSubCategory_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Sub Category Id Not Valid Format Please Try Another One...') 
]