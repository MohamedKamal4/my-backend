//  Reusable وميزته انه Api Crud Opreration مهمه الكلاس ده اني اقدر استخدمو في كل مكان ومع اي خطا قد ينتج عنه العمليات الخاصه ب 
class ApiError extends Error {
    constructor (message , statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error'
        this.isOperational = true
    }
}

module.exports = ApiError