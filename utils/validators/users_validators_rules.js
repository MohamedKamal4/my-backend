const { check, body } = require("express-validator");
const userModel = require("../../models/user_models")
const bcrypt = require("bcryptjs")

exports.validator_create_User_rules = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),

    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .custom((email) => 
            userModel.findOne({email: email}).then((user) => {
                if(user){
                    return Promise.reject(new Error(`This Email ${email} Is Used Try Another One`))
                }
            })
        ),
        
    check('phone')
        .notEmpty()
        .withMessage('Phone number is required')
        .isMobilePhone('ar-EG')
        .withMessage('Please enter a valid phone number'),

    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),

    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }

            return true;
        })
];

exports.validator_update_User_rules = [
    check('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID format'),

    check('name')
        .optional()
        .isString()
        .withMessage('Name must be a string')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),

    check('email')
        .optional()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail()
        .custom((email) => 
            userModel.findOne({email}).then((user) => {
                if(user){
                    return Promise.reject(new Error(`This Email ${email} Is Used Try Another One`))
                }
            })
        ),
    check('phone')
        .optional()
        .isMobilePhone('ar-EG')
        .withMessage('Please enter a valid Egyptian phone number'),
]

exports.validator_get_User_rules = [
    check('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID format')
]

exports.validator_delete_User_rules = [
    check('id')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid User ID format')
]

exports.validator_update_User_password_rules = [
    check('id')
        .notEmpty()
        .withMessage('User ID is required')
        .isMongoId()
        .withMessage('Invalid User ID format'),
    check('currentPassword')
        .notEmpty()
        .withMessage('Current Password is required'),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    check('passwordConfirm')
        .notEmpty()
        .withMessage('Password confirmation is required'),
    body().custom(async (value , {req}) => {
        const { id } = req.params
        const user = await userModel.findById(id)

        if (!user) throw new Error("User not found")

        const { currentPassword , password , passwordConfirm } = req.body
        
        const isCorrectPassword = await bcrypt.compare( currentPassword, user.password) // بيعمل مقارنه بين الباس العادي والمشفر
        if (!isCorrectPassword) {
            throw new Error('Current Password Is Incorrect');
        }

        const isExistPassword = await bcrypt.compare( password , user.password)
        if (isExistPassword) {
            throw new Error('Choose A Different Password');
        }
        
        if (passwordConfirm !== password) {
            throw new Error('Password confirmation does not match password');
        }

        return true;
    })
]