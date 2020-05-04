const mongoose = require('mongoose')
const ProductSchema = require('./schemas/products')
const ProductModel = mongoose.model('products', ProductSchema)

module.exports = ProductModel
