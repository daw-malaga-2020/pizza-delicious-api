const mongoose = require('mongoose')
const Schema = mongoose.Schema

let itemSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  excerpt: { type: String, required: true },
  body: { type: String, required: true },
  publish_at: { type: Date, default: Date.now },
  categories: [{ type: String, required: true }],
  tags: [{ type: String, required: true }],
  enabled: { type: Boolean, default: false },
});

module.exports = itemSchema
