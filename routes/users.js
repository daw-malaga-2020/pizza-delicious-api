'use strict'

const express = require('express')
const router = express.Router()
const md5 = require('md5')
const User = require('../models/users')
//middleware configurable para autenticación
const authMiddleware = require('../middlewares/authentication')

//middleware configurable para usar el método sólo administradores
const methodAllowedOnlyForAdmins = authMiddleware(['admin'], true)
//middleware configurable para usar el método usuarios y administradores
const methodAllowedForUsersAndAdmins = authMiddleware(['user', 'admin'], true)

router.route('/users')
  .get(methodAllowedOnlyForAdmins, async (req, res) => {
    let itemList = await User.find().exec()

    let filteredList = itemList.map((item) => {
      let clonedItem = { ...item.toJSON() }

      delete clonedItem.password

      return clonedItem
    })

    res.json(filteredList)
  })
  .post(async (req, res) => {

    req.body.password = md5(req.body.password)

    let newItem = await new User(req.body).save()

    let createdItem = newItem.toJSON()
    delete createdItem.password

    res.status(201).json(createdItem)

  })

router.route('/users/:id')
  .get(methodAllowedForUsersAndAdmins, async (req, res) => {

    let searchId = req.params.id

    if (req.user.profile !== 'admin' && searchId !== req.user.id) {
      res.status(403).json({ 'message': 'Permisos insuficientes' })
      return
    }

    let foundItem = await User.findById(searchId).exec()

    if (!foundItem) {
      console.info(searchId, "No encontrado")
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    let foundUser = foundItem.toJSON()
    delete foundUser.password

    res.json(foundUser)
  })
  .put(methodAllowedForUsersAndAdmins, async (req, res) => {

    let searchId = req.params.id
    let filters = {_id: searchId}

    if (req.user.profile !== 'admin' && searchId !== req.user.id) {
      res.status(403).json({ 'message': 'Permisos insuficientes' })
      return
    }

    let foundItem = await User.findOneAndUpdate(filters,req.body, {new: true}).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    let foundUser = foundItem.toJSON()
    delete foundUser.password

    res.json(foundUser)
  })
  .delete(methodAllowedForUsersAndAdmins, async (req, res) => {
    let searchId = req.params.id
    let filters = {_id: searchId}

    if (req.user.profile !== 'admin' && searchId !== req.user.id) {
      res.status(403).json({ 'message': 'Permisos insuficientes' })
      return
    }

    let foundItem = await User.findOneAndDelete(filters).exec()

    if (!foundItem) {
      res.status(404).json({ 'message': 'El elemento que intentas eliminar no existe' })
      return
    }

    res.status(204).json()
  })

module.exports = router
