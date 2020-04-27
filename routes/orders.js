const express = require('express')
const router = express.Router()
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForUsers = authMiddleware(['user'], true)
//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
//middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/orders')
  .get(methodAllowedForUsersAndAdmins, (req, res) => {
    let itemList = req.app.get('orders')

    //si no es un admin
    if (req.user.profile !== 'admin') {
      itemList = itemList.filter(item => item.user.id === req.user.id)
    }

    res.json(itemList)
  })
  .post(methodAllowedOnlyForUsers, (req, res) => {

    let itemList = req.app.get('orders')

    let newItem = { ...{ id: itemList.length + 1 }, ...req.body }
    //asocia al pedido el id del usuario identificado para evitar que quien lo crea pueda hacerlo a nombre de otro usuario
    newItem.user.id = req.user.id

    itemList.push(newItem)
    req.app.set('orders', itemList)


    res.status(201).json(newItem)
  })

router.route('/orders/:id')
  .get(methodAllowedForUsersAndAdmins, (req, res) => {

    let itemList = req.app.get('orders')
    let searchId = parseInt(req.params.id)

    let foundItem = itemList.find(item => item.id === searchId)

    if (req.user.profile !== 'admin') {
      //busca dentro de los pedidos asociados a su usuario (por su identificador)
      foundItem = itemList.find(item => item.id === searchId && item.user.id === req.user.id)
    }

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    res.json(foundItem)
  })
  .put(methodAllowedOnlyForAdmins, (req, res) => {

    let itemList = req.app.get('orders')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = itemList.findIndex(item => item.id === searchId)

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = itemList[foundItemIndex]

    updatedItem = { ...updatedItem, ...req.body }

    itemList[foundItemIndex] = updatedItem
    req.app.set('orders', itemList)

    res.json(updatedItem)
  })

module.exports = router
