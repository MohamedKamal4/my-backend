const { validationResult } = require("express-validator")

// The Validtion Layer For Catch Errors From Rules Http Request Is Exist
// فايدته انو بيتحقق من صحه البيانات المرسله قبل ان توصل لقاعده البيانات واذا تم التححق وتم العثور علي خطا يتم ارسال نتيجه الخطا من الطبقه دي وليست من قاعده البيانات لانها لم تصل اليها في الاساس
exports.handling_validation_error_middleware = (req , res , next) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors : errors.array() })
    }
    next()
}
