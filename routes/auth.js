const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('../modules/config')
const md5 = require('md5')
const mailer = require('../modules/mailer')

router.route('/auth/login')
  .post((req, res) => {

    let userList = req.app.get('users') //obtiene de la variable global los usuarios
    let credentials = req.body

    let foundItem = userList.find(item => (item.email === credentials.email && item.password === md5(credentials.password)))

    if (!foundItem) {
      res.status(401).json({ 'message': 'El usuario y/o contraseña son incorrectos' })
      return
    }

    delete foundItem.password

    let jwtPayload = {
      id: foundItem.id,
      firstname: foundItem.firstname,
      profile: foundItem.profile
    }

    let generatedToken = jwt.sign(jwtPayload, config.APP_SECRET, {
      expiresIn: config.APP_TOKEN_VALIDITY_IN_DAYS + ' days'
    })

    if (!generatedToken) {
      res.status(500).json({ 'message': 'No ha sido posible iniciar sesión con el usuario. Inténtalo más tarde' })
    }

    res.json({ 'token': generatedToken })
  })

router.route('/auth/forgotten-password')
  .post((req, res) => {

    let userList = req.app.get('users') //obtiene de la variable global los usuarios
    let searchEmail = req.body.email

    let foundItem = userList.find(item => item.email === searchEmail)

    if (!foundItem) {
      res.status(404).json({ 'message': 'No existe el email en nuestra base de datos' })
      return
    }

    //enviamos por email los datos para modificar su contraseña (a una nueva)
    mailer.send(req.body.email, config.FORGOTTEN_PASSWORD_SUBJECT, config.FORGOTTEN_PASSWORD_BODY, false)

    res.json({ 'message': 'Te hemos enviado un email desde el que podrás modificar tu contraseña de forma segura' })
  })

module.exports = router
