'use strict'

const express = require('express')
const router = express.Router()

const mailer = require('../modules/mailer')
const config = require('../modules/config')
const Contact = require('../models/contacts')

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/contacts')
  .get(methodAllowedOnlyForAdmins, async (req, res) => {
    let itemList = await Contact.find().exec()

    res.json(itemList)
  })
  .post(async (req, res) => {

    let newItem = await new Contact(req.body).save()

    mailer.send(config.ADMIN_EMAIL,config.CONTACT_SUBJECT,config.CONTACT_BODY, false)

    res.status(201).json(newItem)
  })

router.route('/contacts/:id')
  .get(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Contact.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .delete(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Contact.findOneAndDelete({_id: searchId}).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.status(204).json()
  })

module.exports = router
