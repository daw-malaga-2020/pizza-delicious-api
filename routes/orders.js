const express = require('express')
const router = express.Router()
const Orders = require('../models/orders')

//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForUsers = authMiddleware(['user'], true)
//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
//middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/orders')
  .get(methodAllowedForUsersAndAdmins, async (req, res) => {
    let filters = {}

    //si no es un admin
    if (req.user.profile !== 'admin') {
      filters.user = { id: req.user.id }
    }

    let itemList = await Orders.find(filters).exec()

    res.json(itemList)
  })
  .post(methodAllowedOnlyForUsers, async (req, res) => {
    let newItem = await new Orders(req.body).save()

    res.status(201).json(newItem)
  })

router.route('/orders/:id')
  .get(methodAllowedForUsersAndAdmins, async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Orders.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    console.info(req.user.profile, foundItem.user.id, req.user.id)
    if(req.user.profile !== 'admin' && foundItem.user.id !== req.user.id){
      res.status(403).json({ 'message': 'Permiso denegado' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let updatedItem = await Orders.findOneAndUpdate({ _id: searchId }, req.body, { new: true }).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json(updatedItem)
  })

router.route('/orders/:id/status')
  .put(methodAllowedOnlyForAdmins, async (req, res) => {
    let updateFields = { status: req.body.status }
    let searchId = req.params.id
    let updatedItem = await Orders.findOneAndUpdate({ _id: searchId }, updateFields, { new: true }).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json({ status: updatedItem.status })
  })

module.exports = router
