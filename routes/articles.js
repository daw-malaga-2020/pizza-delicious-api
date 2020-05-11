const express = require('express')
const router = express.Router()
const Articles = require('../models/articles')
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/articles')
  .get(async (req, res) => {
    let itemList = await Articles.find().exec()

    res.json(itemList)
  })
  .post(methodAllowedOnlyForAdmins, async (req, res) => {

    let newItem = await new Articles(req.body).save()

    res.status(201).json(newItem)
  })

router.route('/articles/:id')
  .get(async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Articles.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let updatedItem = await Articles.findOneAndUpdate({_id: searchId}, req.body, {new: true}).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json(updatedItem)
  })
  .delete(methodAllowedOnlyForAdmins, async (req, res) => {

    let searchId = req.params.id

    let foundItem = await Articles.findOneAndDelete({_id: searchId}).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.status(204).json()
  })

module.exports = router
