// تستخدم للربط بقاعده البيانات mongoDB هي مكتبه خاصه ب
const mongoose = require('mongoose')

// mongoose schema & model
const categorySchema = new mongoose.Schema({
    name: {
        type: String ,
        required: [true , 'The Category Must Be Required'],
        unique: [true , 'The Category Must Be Unique'],
        minLength: [3, 'The Category Very Short'],
        maxLength: [32, 'The Category Very Long']
    },
    slug: { // jeans pants => jeans-pants in url 
        type: String ,
        lowercase: true
    },
    image: String ,
},
{
    timestamps: true // يضع تاريخ الانشاء وتاريخ التحديث
})

const categoryModel = mongoose.model('category' , categorySchema)

module.exports = categoryModel