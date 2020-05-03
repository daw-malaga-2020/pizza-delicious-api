'use strict'

//dependencias usadas
const express = require('express')
const bearerToken = require('express-bearer-token')
const cors = require("cors");
//instancia de express
const app = express()

//configuramos middlewares usados
app.use(bearerToken())
app.use(express.json())
app.use(cors())

//Init Data
const initProducts = require('./data/products.json')
const initArticles = require('./data/articles.json')
const initOrders = require('./data/orders.json.json')

//traemos las rutas de ficheros externos
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const articlesRoutes = require('./routes/articles')
const ordersRoutes = require('./routes/orders')
const contactsRoutes = require('./routes/contacts')

//crea variables globales para escribir/leer los datos desde cualquier sitio
app.set("products", initProducts.data)
app.set("articles", initArticles.data)
//inicia usuario de pruebas
app.set("users", [{
  id: 1,
  firstname: 'Juan Manuel',
  lastname: 'Castillo',
  email: 'juanma@test.es',
  password: '098f6bcd4621d373cade4e832627b4f6',
  profile: 'admin',
  enabled: true
},
{
  id: 2,
  firstname: 'Alex',
  lastname: 'Martín',
  email: 'alex@test.es',
  password: '098f6bcd4621d373cade4e832627b4f6',
  profile: 'user',
  enabled: true
}])
//contraseña: test
app.set("orders", initOrders.data)
app.set("contacts", [])

//enganchamos las rutas
app.use(productsRoutes)
app.use(usersRoutes)
app.use(authRoutes)
app.use(articlesRoutes)
app.use(ordersRoutes)
app.use(contactsRoutes)

//exponemos la instancia configurada de la app
module.exports = app
