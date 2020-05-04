const express = require('express')
const router = express.Router()
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)

router.route('/articles')
  .get((req, res) => {
    let itemList = req.app.get('articles')
    res.json(itemList)
  })
  .post(methodAllowedOnlyForAdmins, (req, res) => {

    let itemList = req.app.get('articles')

    let newItem = { ...{ id: itemList.length + 1 }, ...req.body }

    itemList.push(newItem)
    req.app.set('articles', itemList)


    res.status(201).json(newItem)
  })

router.route('/articles/:id')
  .get((req, res) => {

    let itemList = req.app.get('articles')
    let searchId = parseInt(req.params.id)

    let foundItem = itemList.find(item => item.id === searchId)

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins,(req, res) => {

    let itemList = req.app.get('articles')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = itemList[foundItemIndex]

    updatedItem = { ...updatedItem, ...req.body }

    itemList[foundItemIndex] = updatedItem
    req.app.set('articles', itemList)

    res.json(updatedItem)
  })
  .delete(methodAllowedOnlyForAdmins,(req, res) => {

    let itemList = req.app.get('articles')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    itemList.splice(foundItemIndex, 1)
    req.app.set('articles', itemList)

    res.status(204).json()
  })

module.exports = router
