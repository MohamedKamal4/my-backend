const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type : String ,
        trim : true ,
        required: [true , "The User Name Is Required"]
    },
    slug: {
        type: String ,
        lowercase: true
    },
    email: {
        type: String ,
        required : [true , 'The Email Is Required'] ,
        unique: [true , 'The Email Must Be Unique'] ,
        lowercase: true
    },
    phone: {
        type: Number,
        minLength: [11, 'The Phone Must Be Equal 11 Numbers'],
    },
    profile: {
        secure_url: String,
        public_id: String
    },
    password: {
        type: String ,
        required: [true , 'The Password Is Required'],
        minLength: [8 , 'Too Short Password']        
    },
    passwordChangedAt: Date ,
    role: {
        type: String ,
        enum: ["user" , "admin"],
        default: "user"
    },
    cart: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products",
            required: true
        },
        size: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: Number,
            min: 1,
            required: true
        }
    }],
    orders: [{
        items: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            size: {
                type: String,
                required: true,
                trim: true
            },
            quantity: {
                type: Number,
                min: 1,
                required: true
            }
        }],
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    active: {
        type: Boolean ,
        default : true
    }
},{
    timestamps: true
})

//قبل حفظ البيانات عند اضافه مستخدم او تعديل مستخدم يتم تشغيل الداله دي لتشفير الباسورد
//mongoose moddleware
userSchema.pre("save" , async function(){
    if(!this.isModified("password")) return // هنا لو محصلش تعديل علي الباسورد بيتخطي التشفير
    this.password = await bcrypt.hash(this.password , 12)
})

const userModel = mongoose.model("users" , userSchema)

module.exports = userModel