const Delete = require("./requests/deleteRequest")
const Update = require("./requests/updateRequest")
const GetSpecificItem = require("./requests/getSpecificItem")
const Create = require("./requests/createItem")
const GetItems = require("./requests/getItems")
const subCategoryModel = require("../models/subCategory_models")


//----------------------------------
exports.getSubCategories = GetItems(subCategoryModel)
//----------------------------------
exports.getSubCategory = GetSpecificItem(subCategoryModel , 'Sub Category')
//----------------------------------
exports.createSubCategory = Create(subCategoryModel)
//----------------------------------
exports.updateSubCatagory = Update(subCategoryModel , 'Sub Category')
//----------------------------------
exports.deleteSubCategory = Delete(subCategoryModel , 'Sub Category')
//----------------------------------