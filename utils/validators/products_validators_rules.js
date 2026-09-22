const { check, body } = require("express-validator");
const categoryModel = require("../../models/category_model");
const subCategoryModel = require("../../models/subCategory_models");
const productsModel = require("../../models/products_model");

exports.validator_getProduct_rules = [
    check('id')
        .notEmpty()
        .isMongoId()
        .withMessage('The Product Id Not Valid Format Please Try Another One...')
]

exports.validator_createProduct_rules = [
    check('name')
        .notEmpty()
        .withMessage('Product Name Is Required')
        .isLength({ min: 2, max: 100 })
        .withMessage('The Product Name Must Be At least 2 chr To 32 Chr'),
    check("descraption")
        .notEmpty()
        .withMessage('The Product Descraption Must Be Required')
        .isLength({ min: 20 })
        .withMessage('The Product Descraption Must Be At least 20 chr'),
    check("quantity")
        .notEmpty()
        .withMessage('The Product Quantity Must Be Required')
        .isNumeric()
        .withMessage('The Product Quantity Must A Number'),
    check("orignal_price")
        .notEmpty()
        .withMessage('The Product Quantity Must Be Required')
        .isFloat({ min: 0 })
        .withMessage('The Product Price Must Be A Number'),
    check("price_with_discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage('The Product Price Must Be A Number')
        .custom((value, { req }) => {
            if (req.body.orignal_price <= value) {
                throw new Error('The Price With Discount Most Be Lower Than Orignal Price')
            }
            return true
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage('The Colors Must Be Array Of String'),
    check("main_category")
        .notEmpty()
        .withMessage('The Product Must Be Belong To Main Category')
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom(async (main_category) => {
            const category = await categoryModel.findById(main_category)
            if (!category) {
                throw new Error(`The Category Was Not Found`)
            }
            return true
        }),
    check("sub_category")
        .notEmpty()
        .withMessage('The Product Must Be Belong To Sub Category')
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom(async (sub_category, { req }) => {
            const { main_category } = req.body
            const subCategory_isRelated_parentCategory = await subCategoryModel.findOne({ _id: sub_category, parent_category: main_category })
            if (!subCategory_isRelated_parentCategory) {
                throw new Error(`This Sub Category Is Not Related To In The Selected Main Category Try Another One... `)
            }
            return true
        }),
    check("brand")
        .notEmpty()
        .withMessage('The Product Must Be Belong To Brands')
        .isMongoId()
        .withMessage("Invalid Id Format"),
    check('rating_average')
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating Must Be Between 1.0 And 5.0"),

    check('sizes')
        .optional()
        .isArray()
        .withMessage('Invalid Sizes Format...')
]

exports.validator_updateProduct_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Product Id Not Valid Format Please Try Another One...'),
    check('name')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('The Product Name Must Be At least 2 chr To 32 Chr'),
    check("descraption")
        .optional()
        .isLength({ min: 20 })
        .withMessage('The Product Descraption Must Be At least 20 chr'),
    check("quantity")
        .optional()
        .isNumeric()
        .withMessage('The Product Quantity Must A Number'),
    check("orignal_price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage('The Product Price Must Be A Number'),
    check("price_with_discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage('The Product Price Must Be A Number')
        .custom(async (value, { req }) => {
            const { id } = req.params
            const product = await productsModel.findById(id)

            if (!product) {
                throw new Error(`The Product Was Not Found`)
            }

            const orignal_price = req.body.orignal_price ?? product.orignal_price
            if (orignal_price <= value) {
                throw new Error('The Price With Discount Most Be Lower Than Orignal Price')
            }
            return true
        }),
    check("colors")
        .optional()
        .isArray()
        .withMessage('The Colors Must Be Array Of String'),
    check("main_category")
        .optional()
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom(async (main_category, { req }) => {
            const category = await categoryModel.findById(main_category)
            if (!category) {
                throw new Error(`The Category Was Not Found`)
            }
            return true
        }),
    check("sub_category")
        .optional()
        .isMongoId()
        .withMessage("Invalid Id Format")
        .custom(async (sub_category, { req }) => {
            const subCategory = await subCategoryModel.findById(sub_category)
            if (!subCategory) {
                throw new Error(`The Sub Category Was Not Found`)
            }
            return true
        }),
    check("brand")
        .optional()
        .isMongoId()
        .withMessage('Invalid Id Format'),
    check('rating_average')
        .optional()
        .isFloat({ min: 1, max: 5 })
        .withMessage("Rating Must Be Between 1.0 And 5.0"),
    check('sizes')
        .optional()
        .isArray()
        .withMessage('Invalid Sizes Format...'),
    body().custom(async (_, { req }) => {

        const { id } = req.params;
        const product = await productsModel.findById(id);

        if (!product) {
            throw new Error(
                `The Product Was Not Found`
            );
        }

        const mainCategoryId =
            req.body.main_category ?? product.main_category;

        const subCategoryId =
            req.body.sub_category ?? product.sub_category;

        const subCategory = await subCategoryModel.findOne({
            _id: subCategoryId,
            parent_category: mainCategoryId
        });

        if (!subCategory) {
            throw new Error(
                `This Sub Category Is Not Related To In The Selected Main Category Try Another One...`
            );
        }

        return true;
    }),
]

exports.validator_deleteProduct_rules = [
    check('id').notEmpty().isMongoId().withMessage('The Product Id Not Valid Format Please Try Another One...')
]
