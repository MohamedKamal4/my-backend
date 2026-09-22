const Delete = require('./requests/deleteRequest')
const Update = require('./requests/updateRequest')
const GetSpecificItem = require('./requests/getSpecificItem')
const Create = require('./requests/createItem')
const GetItems = require('./requests/getItems')
const productsModel = require('../models/products_model')



//----------------------------------
exports.getProducts = GetItems(productsModel)
//----------------------------------
exports.getProduct = GetSpecificItem(productsModel , 'Product')
//----------------------------------
exports.createProduct = Create(productsModel )
//----------------------------------
exports.updateProduct = Update(productsModel , 'Product')
//----------------------------------
exports.deleteProduct = Delete(productsModel , 'Product')
//----------------------------------


