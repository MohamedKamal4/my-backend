const AsyncHandler = require("express-async-handler")
const ApiFeatures = require("../../utils/api_features")

function GetItems(model){
    return AsyncHandler(async (req , res) => {
        const apiWithFeatures = new ApiFeatures(model.find() , req).filter().search().applyFilterAndSearch().sort().limitFields().paginate()
        const page = apiWithFeatures.page
        const data = await apiWithFeatures.mongooseQuery
        res.status(200).json({
            results : data.length ,
            page ,
            data: data
        })
    })
}

module.exports = GetItems
