const express = require('express')
const router = express.Router()
const Products = require('../models/products')
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/products')
  .get(async (req, res) => {
    let itemList = await Products.find().exec()

    res.json(itemList)
  })
  .post(methodAllowedOnlyForAdmins, async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE

    let newItem = await new Products(req.body).save()

    res.status(201).json(newItem)
  })

router.route('/products/:id')
  .get(async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> propio middleware de la ruta >> RESPONSE
    let searchId = req.params.id

    let foundItem = await Products.findById(searchId).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE
    let searchId = req.params.id

    let updatedItem = await Products.findOneAndUpdate({_id: searchId}, req.body, {new: true}).exec()

    if (!updatedItem) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    res.json(updatedItem)
  })
  .delete(methodAllowedOnlyForAdmins, async (req, res) => {
    //REQUEST >> bearerToken >> express.json >> methodAllowedOnlyForAdmins >> propio middleware de la ruta >> RESPONSE
    let searchId = req.params.id

    let foundItem = await Products.findOneAndDelete({_id: searchId}).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.status(204).json()

  })

module.exports = router
