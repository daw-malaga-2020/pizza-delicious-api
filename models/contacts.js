const mongoose = require('mongoose')
const ContactSchema = require('./schemas/contacts')
const ContactModel = mongoose.model('contacts', ContactSchema)

module.exports = ContactModel
