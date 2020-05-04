const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = new Schema({
  user: {
    id: {type: String, required: true },
    firstname: {type: String, required: true },
    lastname: {type: String, required: true },
    address: {type: String, required: true },
    phone: {type: String, required: true },
  },
  products: [{
    title: {type: String, required: true },
    image: {type: String, required: true },
    description: {type: String, required: true },
    price: {type: Number, required: true },
    quantity: {type: Number, required: true },
    category: {type: String, required: true },
  }],
  total: { type: Number, required: true },
  status: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  shipped_at: { type: Date },
});

module.exports = itemSchema
