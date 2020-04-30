'use strict'

const config = require('../config')
const jwt = require('jsonwebtoken')
const defaultUserProfile = 'user'

function authenticationVerify(allowedProfiles, authRequired = true) {
  return (req, res, next) => {
    //el middleware guarda la informaicón del usuario logado en la petición para ser usada DESPUÉS POR LA APP
    req.user = null

    if (!authRequired && !req.token) {
      next()
    }

    if (!req.token) {
      res.status(403).json({ 'message': 'Debes estar autenticado para usar este método' })
      return
    }

    jwt.verify(req.token, config.APP_SECRET, (err, tokenData) => {

      if (err) {
        res.status(403).json({ 'message': 'El token recibido no es válido' })
      }

      let userProfile = tokenData.profile || defaultUserProfile

      if (!isAllowedProfile(userProfile, allowedProfiles)) {
        res.status(403).json({ 'message': 'No tienes permisos suficientes' })
      }

      //guarda la información del token en
      req.user = tokenData

      next()
    })
  }
}

function isAllowedProfile(current, alloweds) {
  if (typeof alloweds === 'string') {
    alloweds = [alloweds]
  }

  //si el perfil recibido esta entre los permitidos devuelve true (false en caso contrario al ser la respuesta más restrictiva)
  return (alloweds.indexOf(current) !== -1) ? true : false
}


module.exports = authenticationVerify
