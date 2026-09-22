// تستخدم للربط بقاعده البيانات mongoDB هي مكتبه خاصه ب
const mongoose = require('mongoose')

const db_connect = () => {
    // mongoDB الربط بالداتا بيز عن طريق جلب اللينك ده من الكونكت بتاع الكالستر الي في
    mongoose.connect(process.env.DB_CONNECT_FOR_MONGOOSE_URI)
    .then((connect) => {
        console.log(`Data Base Connection By => ${connect.connection.host}`)
    })
}

module.exports = db_connect