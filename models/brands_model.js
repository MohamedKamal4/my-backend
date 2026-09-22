const mongoose = require("mongoose");


const brandsSchema = mongoose.Schema({
    name: {
        type: String ,
        required: [true , 'The Brand Must Be Required'],
        unique: [true , 'The Brand Must Be Unique'],
        minLength: [2, 'The Brand Name Very Short'],
        maxLength: [32, 'The Brand Name Very Long']
    },
    slug: {
        type : String ,
        lowrcase: true
    },
    image: String,
},{
    timestamps: true    
})

const brandsModel = mongoose.model('brands' , brandsSchema)

module.exports = brandsModel