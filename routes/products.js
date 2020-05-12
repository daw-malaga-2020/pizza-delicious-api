const express = require('express')
const router = express.Router()
const Products = require('../models/products')
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

const methodAllowedAuthOptional = authMiddleware(['user','admin'], false)

router.route('/products')
  .get(methodAllowedAuthOptional, async (req, res) => {
    let filters = {}

    //OBJETIVO: Si un usuario no autenticado o usuario autenticado pero que no tiene el perfil admin entonces devolver solo los productos visibles
    // Si el usuario no es admin -> añadir filtro para devolver sólo productos enabled === true
    if(!req.user){
      filters.enabled = true
    }

    let itemList = await Products.find(filters).exec()

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
