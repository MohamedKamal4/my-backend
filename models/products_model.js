const mongoose = require('mongoose')

const productsSchema = mongoose.Schema({
    name : {
        type: String ,
        trim: true ,
        required: [true , 'The Product Must Be Required'],
        unique: [true , 'The Product Must Be Unique'],
        minLength: [2, 'The Product Name Very Short'],
        maxLength: [100, 'The Product Name Very Long']
    },
    slug: {
        type: String ,
        lowercase: true
    },
    Image_Cover: {
        secure_url : String ,
        public_id : String
    } ,
    Images: [{
        secure_url : String ,
        public_id : String
    }] ,
    descraption: {
        type: String ,
        default: "",
        required: [true , 'The Product Descraption Must Be Required'],
        minLength: [20, 'The Product Descraption Very Short'],
    },
    quantity: {
        type: Number ,
        default: 0,
        required: [true , 'The Product Quantity Must Be Required'],
    },
    sold: {
        type: Number ,
        default: 0
    },
    orignal_price: {
        type: Number ,
        default: 0 ,
        required: [true , 'The Product Price Must Be Required'],
        trim: true ,
    },
    price_with_discount: {
        type: Number ,
        default: 0
    },
    colors: [String],
    sub_category: {
        type: mongoose.Schema.ObjectId ,
        ref: 'subCategory',
        required: [true , 'The Product Must Be Belong To Sub Category']
    },
    main_category: {
        type: mongoose.Schema.ObjectId ,
        ref: 'category',
        required: [true , 'The Product Must Be Belong To Main Category']
    },
    brand: {
        type: mongoose.Schema.ObjectId ,
        ref: 'brands',
        required: [true , 'The Product Must Be Belong To Brands']
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            rating:{
                type: Number ,
                min: [1 , "Rating Must Be Above Or Equal 1.0"],
                max: [5 , "Rating Must Be Below Or Equal 5.0"],
            },
            comment: String
        }
    ],        
    sizes: [String]
},{
    timestamps : true
})

// mongoose middleware to build action for find event
productsSchema.pre(/^find/ , function (){
    this.populate({path : ["main_category" , "sub_category" , "brand"]})
})


const productsModel = mongoose.model('products' , productsSchema)

module.exports = productsModel
