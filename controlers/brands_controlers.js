const Delete = require('./requests/deleteRequest')
const Update = require('./requests/updateRequest')
const GetSpecificItem = require('./requests/getSpecificItem')
const Create = require('./requests/createItem')
const GetItems = require('./requests/getItems')
const brandsModel = require('../models/brands_model')


//----------------------------------
exports.getBrands = GetItems(brandsModel)
//----------------------------------
exports.createBrand = Create(brandsModel)
//----------------------------------
exports.getBrandById = GetSpecificItem(brandsModel , 'Brand')
//----------------------------------
exports.updateBrandById = Update(brandsModel , 'Brand')
//----------------------------------
exports.deleteBrandById = Delete(brandsModel , 'Brand')
//----------------------------------
