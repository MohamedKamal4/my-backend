const Delete = require('./requests/deleteRequest')
const Update = require('./requests/updateRequest')
const GetSpecificItem = require('./requests/getSpecificItem')
const Create = require('./requests/createItem')
const GetItems = require('./requests/getItems')
const categoryModel = require('../models/category_model')

//----------------------------------
exports.getCategories = GetItems(categoryModel)
//----------------------------------
exports.getCategory = GetSpecificItem(categoryModel , 'Category')
//----------------------------------
exports.createCategory = Create(categoryModel)
//----------------------------------
exports.updateCatagory = Update(categoryModel , 'Category')
//----------------------------------
exports.deleteCategory = Delete(categoryModel , 'Category')
//----------------------------------
