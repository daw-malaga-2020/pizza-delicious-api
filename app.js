'use strict'

//dependencias usadas
const express = require('express')
const bearerToken = require('express-bearer-token')
const cors = require("cors");
const database = require('./modules/database')
//instancia de express
const app = express()

//configuramos middlewares usados
app.use(bearerToken())
app.use(express.json())
app.use(cors())

//Init Data
const initProducts = require('./data/products.json')
const initArticles = require('./data/articles.json')
const initOrders = require('./data/orders.json')

//traemos las rutas de ficheros externos
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const articlesRoutes = require('./routes/articles')
const ordersRoutes = require('./routes/orders')
const contactsRoutes = require('./routes/contacts')

//contraseña: test
app.set("orders", initOrders.data)

//enganchamos las rutas
app.use(productsRoutes)
app.use(usersRoutes)
app.use(authRoutes)
app.use(articlesRoutes)
app.use(ordersRoutes)
app.use(contactsRoutes)

database.connect()

//exponemos la instancia configurada de la app
module.exports = app
