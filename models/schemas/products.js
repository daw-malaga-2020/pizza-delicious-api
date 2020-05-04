const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  enabled: { type: Boolean, default: false },
});

module.exports = itemSchema
