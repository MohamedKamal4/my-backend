// تستخدم للربط بقاعده البيانات mongoDB هي مكتبه خاصه ب
const mongoose = require('mongoose')

// mongoose schema & model
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String ,
        trim: true , // Remove Any Spacies From Sub Category Name | Ex: Jeans pants => jeanspants
        required: [true , 'The Sub Category Must Be Required'],
        unique: [true , 'The Sub Category Must Be Unique'],
        minLength: [2, 'The Sub Category Very Short'],
        maxLength: [32, 'The Sub Category Very Long']
    },
    slug: { // jeans pants => jeans-pants in url 
        type: String ,
        lowercase: true
    },
    image: String ,
    parent_category: {
        type: mongoose.Schema.ObjectId ,
        ref: 'category',
        required: [true , 'The Sub Category Must Be Belong To Parent Category']
    }

},
{
    timestamps: true // يضع تاريخ الانشاء وتاريخ التحديث
})

const subCategoryModel = mongoose.model('subCategory' , subCategorySchema)

module.exports = subCategoryModel