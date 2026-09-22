const { check, body } = require("express-validator");
const userModel = require("../../models/user_models")
const bcrypt = require("bcryptjs")

exports.register_User_rules = [
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

exports.login_user_rules = [
    check('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    check('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body().custom(async (value , {req}) => {
        const { email , password } = req.body

        const user = await userModel.findOne({email})
        if (!user) throw new Error("Incorrect Email Or Password")
            
        const isCorrectPassword = await bcrypt.compare( password, user.password) // بيعمل مقارنه بين الباس العادي والمشفر
        if (!isCorrectPassword) throw new Error("Incorrect Email Or Password")

        return true;
    })
]