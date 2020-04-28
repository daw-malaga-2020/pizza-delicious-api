'use strict'

//dependencias usadas
const express = require('express')
const bearerToken = require('express-bearer-token')

//instancia de express
const app = express()

//configuramos middlewares usados
app.use(bearerToken())
app.use(express.json())

//traemos las rutas de ficheros externos
const productsRoutes = require('./routes/products')
const usersRoutes = require('./routes/users')
const authRoutes = require('./routes/auth')
const articlesRoutes = require('./routes/articles')
const ordersRoutes = require('./routes/orders')
const contactsRoutes = require('./routes/contacts')

const baseAssets = "https://colorlib.com/preview/theme/pizza"

//crea variables globales para escribir/leer los datos desde cualquier sitio
app.set("products", [
  {id: 1, category: "pizza", title: "Pizza 1", img: `${baseAssets}/images/pizza-1.jpg`, desc: "Esta es una pizza 1", price: 10},
  {id: 2, category: "pizza", title: "Pizza 2", img: `${baseAssets}/images/pizza-2.jpg`, desc: "Esta es una pizza 2", price: 9},
  {id: 3, category: "pizza", title: "Pizza 3", img: `${baseAssets}/images/pizza-3.jpg`, desc: "Esta es una pizza 3", price: 7},
  {id: 4, category: "pizza", title: "Pizza 4", img: `${baseAssets}/images/pizza-4.jpg`, desc: "Esta es una pizza 4", price: 11},
  {id: 5, category: "pizza", title: "Pizza 5", img: `${baseAssets}/images/pizza-5.jpg`, desc: "Esta es una pizza 5", price: 15},
  {id: 6, category: "pizza", title: "Pizza 6", img: `${baseAssets}/images/pizza-6.jpg`, desc: "Esta es una pizza 6", price: 6},
  {id: 7, category: "pizza", title: "Pizza 7", img: `${baseAssets}/images/pizza-7.jpg`, desc: "Esta es una pizza 7", price: 9},
  {id: 8, category: "pizza", title: "Pizza 8", img: `${baseAssets}/images/pizza-8.jpg`, desc: "Esta es una pizza 8", price: 10},
  {id: 9, category: "pasta", title: "Pasta 1 ",img: `${baseAssets}/images/pasta-1.jpg`, desc: "Esta es pasta 1", price: 9},
  {id: 10, category:"pasta", title: "Pasta 2 ",img: `${baseAssets}/images/pasta-2.jpg`, desc: "Esta es pasta 2", price: 9},
  {id: 11, category:"pasta", title: "Pasta 3 ",img: `${baseAssets}/images/pasta-3.jpg`, desc: "Esta es pasta 3", price: 9},
  {id: 12, category:"drink", title: "Bebida 1 ",img:`${baseAssets}/images/drink-1.jpg`, desc: "Esta es bebida 1", price: 4},
  {id: 12, category:"drink", title: "Bebida 2 ",img:`${baseAssets}/images/drink-2.jpg`, desc: "Esta es bebida 2", price: 4},
  {id: 13, category:"drink", title: "Bebida 3 ",img:`${baseAssets}/images/drink-3.jpg`,desc: "Esta es bebida 3", price: 3},
  {id: 15, category:"burger", title: "Burger 1 ",img: `${baseAssets}/images/burger-1.jpg`, desc: "Esta es burger 1", price: 9},
  {id: 16, category:"burger", title: "Burger 2 ",img: `${baseAssets}/images/burger-2.jpg`, desc: "Esta es burger 2", price: 9},
  {id: 17, category:"burger", title: "Burger 3 ",img: `${baseAssets}/images/burger-3.jpg`, desc: "Esta es burger 3", price: 9},
])
app.set("articles", [])
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
app.set("orders", [])
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
