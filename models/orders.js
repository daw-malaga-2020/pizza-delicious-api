const mongoose = require('mongoose')
const OrderSchema = require('./schemas/orders')
const OrderModel = mongoose.model('orders', OrderSchema)

module.exports = OrderModel
