// app
const express = require('express')
const app = express()
//------------------------------------------


// env reader
// production || development مختلفه لكل بيئه اذا كانت ports والتي تفيد بتعريف config.env || .env التي موجوده في ملف enviroment varibales  لوضع ال 
const dotenv = require('dotenv') 
dotenv.config({path:'.env'})
//------------------------------------------


// Reusable error & global error handling
const ApiError = require('./utils/api_error')
const { global_error_handling } = require('./middlewares/error_middleware')
//------------------------------------------


// imports routes
const category_route = require('./routes/category_routes')
const subCategory_routes = require('./routes/subCategory_routes')
const brands_routes = require('./routes/brands_routes')
const products_routes = require('./routes/products_routes')
const users_routes = require('./routes/usersRoutes')
const auth_routes = require('./routes/auth_routes')
//------------------------------------------


//db_connect
const db_connect = require('./config/connect_dataBase')
db_connect()
//------------------------------------------


// meddlewares
const morgan = require('morgan') // middelware for node js هو عباره عن
app.use(express.json()) // json فبيتم تحويلها ل string لانها جيالي علي شكل body بيعمل بارسينك للبيانات الي جيالي في ال
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev')) // استخدام المورجان
    console.log(`Currnt Mode => ${process.env.NODE_ENV}`)
}
//------------------------------------------


// mount routes Meddleware
app.use('/api/v1/categories' , category_route)
app.use('/api/v1/subCategories' , subCategory_routes)
app.use('/api/v1/brands' , brands_routes)
app.use('/api/v1/products' , products_routes)
app.use('/api/v1/users' , users_routes)
app.use('/api/v1/auth' , auth_routes)
//------------------------------------------


// using global error handling & Reusable error 
// Catch Error Route Without Mount In My Routes And Send It To Error Handling Meddleware
app.all("/{*splat}" , (req , res , next) => {
    next(new ApiError(`Can't Find This Route ${req.originalUrl}` , 400)) // Send Error To Handling Meddleware
})
// Global Error Handling Meddleware Using Express
app.use(global_error_handling)
//------------------------------------------


// start app with port
const PORT = process.env.PORT
const app_port = app.listen(PORT , ()=> {
    console.log(`app is running with port ${PORT}`)
})
//------------------------------------------

// global error handling for un handled Rejection
// Global Error Handling Meddleware For Any Errors Usin Promise(async & await) Out Of Express Like (Database Connection)
process.on('unhandledRejection' , (err) => {
    console.log(`Un Handled Rejection Errors => ${err.name} | ${err.message}`)
    //الاول requests غلق جميع العمليات
    app_port.close(() => { 
        console.log(`The App Is Shut Down`)
        // ثم وقف الابلكيشن
        process.exit(1) 
    })
})
//------------------------------------------
