const brandsModel = require("../models/brands_model")
const categoryModel = require("../models/category_model")
const productsModel = require("../models/products_model")
const subCategoryModel = require("../models/subCategory_models")
const ApiError = require("../utils/api_error")

// filteration by brand id | category id | sub category id
// but first check the id if exist in my db or no 
function createFilterObject({title}){
    return async function (req, res, next) {
        let model
        switch(title){
            case("brand"):
                model = brandsModel
                break
            case("parent_category"):
                model = categoryModel
                break
            case("product"):
                model = productsModel
                break
            case("sub_category"):
                model = subCategoryModel
                break
            case("main_category"):
                model = categoryModel
                break
        }
        const id = req.params.id
        const findById = await model.findById(id)

        if(!findById) { 
            return next(new ApiError(`Can't Find This id ${id}` , 400))
        }

        let filterObj = {}
        if (req.params.id) {
            filterObj = {
                [title]: req.params.id
            }
        }
        req.filterObj = filterObj
        next()
    }
}

function setIdFromParamToBody({title}){ // وضع الاي دي الخاص بالتصنيف الفرعي او الرئيسي او البراند من البرام للبادي
    return function (req , res , next){
        const { id } = req.params
        if(!req.body[title]) req.body[title] = id
        next()
    }
}

module.exports = {createFilterObject , setIdFromParamToBody}
