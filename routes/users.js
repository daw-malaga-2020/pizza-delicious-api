const express = require('express')
const router = express.Router()
const md5 = require('md5')
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
//middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/users')
  .get(methodAllowedOnlyForAdmins, (req, res) => {
    let userList = req.app.get('users')

    filteredList = userList.map((item) => {
      let clonedItem = { ...item }

      delete clonedItem.password

      return clonedItem
    })

    res.json(filteredList)
  })
  .post((req, res) => {

    let userList = req.app.get('users')

    let newItem = { ...{ id: userList.length + 1 }, ...req.body }

    //el password se guarda siempre encriptado con un método no reversible (md5, sha512, ...)
    newItem.password = md5(newItem.password)

    userList.push(newItem)
    req.app.set('users', userList)

    let clonedItem = { ...newItem }

    delete clonedItem.password

    res.status(201).json(clonedItem)

  })

router.route('/users/:id')
  .get(methodAllowedForUsersAndAdmins, (req, res) => {

    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItem = userList.find(item => item.id === searchId)

    if (req.user.profile !== 'admin') {
      foundItem = userList.find(item => item.id === searchId && item.id === req.user.id)
    }

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas obtener no existe' })
      return
    }

    let clonedItem = {...foundItem}

    delete clonedItem.password

    res.json(clonedItem)
  })
  .put(methodAllowedForUsersAndAdmins, (req, res) => {

    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = userList.findIndex(item => item.id === searchId)

    if (req.user.profile !== 'admin') {
      foundItemIndex = userList.findIndex(item => item.id === searchId && item.id === req.user.id)
    }

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas editar no existe' })
      return
    }

    let updatedItem = userList[foundItemIndex]

    delete req.body.id //evita que el id enviado como parte de los datos modifique el id del usuario

    updatedItem = { ...updatedItem, ...req.body }

    userList[foundItemIndex] = updatedItem
    req.app.set('users', userList)

    let clonedItem = {...updatedItem}

    delete clonedItem.password

    res.json(clonedItem)
  })
  .delete(methodAllowedForUsersAndAdmins, (req, res) => {
    let userList = req.app.get('users')
    let searchId = parseInt(req.params.id)

    let foundItemIndex = userList.findIndex(item => item.id === searchId)

    if (req.user.profile !== 'admin') {
      foundItemIndex = userList.findIndex(item => item.id === searchId && item.id === req.user.id)
    }

    if (foundItemIndex === -1) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    userList.splice(foundItemIndex, 1)
    req.app.set('users', userList)

    res.status(204).json()
  })

module.exports = router
