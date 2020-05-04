'use strict'

const faker = require('faker')

let app = require('../app.js')
let tokens = require('./conf/tokens')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

let newItemRef = null
let editedItemRef = null
let editedItemStatusRef = null

describe('orders', () => {
  describe('LIST', () => {

    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        chai.request(app)
          .get('/orders')
          .end((err, res) => {

            //1. comprobamos
            expect(res).to.have.status(401)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            //2. marcamos como finalizado el test
            done()
          })

      })
    })

    describe('AS USER', () => {
      it('Should return status 200 and json as default data format only (owneds orders)', (done) => {
        //todo: check que todos los pedidos son los del propio usuario
        chai.request(app)
          .get('/orders')
          .set('Authorization', tokens.user)
          .end((err, res) => {

            //1. comprobamos
            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.be.an('array')

            //2. marcamos como finalizado el test
            done()
          })

      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/orders')
          .set('Authorization', tokens.admin)
          .end((err, res) => {

            //1. comprobamos
            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.be.an('array')

            //2. marcamos como finalizado el test
            done()
          })

      })
    })

  })

  describe('POST', () => {

    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        newItemRef = createNewItem()

        chai.request(app)
          .post('/orders')
          .send(newItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            //1. comprobamos la respuesta
            expect(res).to.have.status(401)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            //2. marcamos como finalizado el test
            done()
          })
      })
    })

    describe('AS USER', () => {
      it('Should return status 201 and json as default data format', (done) => {

        newItemRef = createNewItem()

        chai.request(app)
          .post('/orders')
          .set('Authorization', tokens.user)
          .send(newItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            //1. comprobamos la respuesta
            expect(res).to.have.status(201)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.greaterThan(0)
            expect(res.body).to.have.property('created_at')
            expect(res.body).to.have.property('shipped_at').to.be.equal(null)
            expect(res.body).to.have.property('products').to.be.an('array')
            expect(res.body).to.have.property('user').to.be.an('object')
            expect(res.body).to.have.deep.nested.property('user', newItemRef.user);
            expect(res.body).to.have.property('total').to.be.greaterThan(0)
            expect(res.body).to.have.property('status').to.be.equal(1)

            //2. guardamos el resultado para siguientes test
            newItemRef = res.body

            //2. marcamos como finalizado el test
            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 403 and json as default data format', (done) => {

        let tempNewItemRef = createNewItem()

        chai.request(app)
          .post('/orders')
          .set('Authorization', tokens.admin)
          .send(tempNewItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            //1. comprobamos la respuesta
            expect(res).to.have.status(403)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            //2. marcamos como finalizado el test
            done()
          })
      })
    })
  })

  describe('GET', () => {

    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        chai.request(app)
          .get('/orders/' + newItemRef.id)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(401)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            done()
          })
      })
    })

    describe('AS USER', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/orders/' + newItemRef.id)
          .set('Authorization', tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('created_at')
            expect(res.body).to.have.property('shipped_at').to.be.equal(null)
            expect(res.body).to.have.property('products').to.be.an('array')
            expect(res.body).to.have.property('user').to.be.an('object')
            expect(res.body).to.have.property('total').to.be.greaterThan(0)
            expect(res.body).to.have.property('status').to.be.greaterThan(0)

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/orders/' + newItemRef.id)
          .set('Authorization', tokens.admin)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('created_at')
            expect(res.body).to.have.property('shipped_at').to.be.equal(null)
            expect(res.body).to.have.property('products').to.be.an('array')
            expect(res.body).to.have.property('user').to.be.an('object')
            expect(res.body).to.have.deep.nested.property('user', newItemRef.user);
            expect(res.body).to.have.property('total').to.be.greaterThan(0)
            expect(res.body).to.have.property('status').to.be.greaterThan(0)

            done()
          })
      })
    })
  })

  describe('PUT', () => {
    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id)
          .send(editedItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(401)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            done()
          })
      })

      it('changing status Should return status 401 and json as default data format', (done) => {

        editedItemStatusRef = modifyItemStatus(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id + '/status')
          .send(editedItemStatusRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(401)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            done()
          })
      })
    })

    describe('AS USER', () => {
      it('Should return status 403 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id)
          .set('Authorization', tokens.user)
          .send(editedItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(403)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            done()
          })
      })

      it('changing status Should return status 403 and json as default data format', (done) => {

        editedItemStatusRef = modifyItemStatus(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id + '/status')
          .set('Authorization', tokens.user)
          .send(editedItemStatusRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(403)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id)
          .set('Authorization', tokens.admin)
          .send(editedItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('created_at')
            expect(res.body).to.have.property('shipped_at').to.be.not.equal(null)
            expect(res.body).to.have.property('products').to.be.an('array')
            expect(res.body).to.have.property('user').to.be.an('object')
            expect(res.body).to.have.deep.nested.property('user', editedItemRef.user);
            expect(res.body).to.have.property('total').to.be.greaterThan(0)
            expect(res.body).to.have.property('status').to.be.greaterThan(1)

            editedItemRef = res.body

            done()
          })
      })

      it('changing status Should return status 200 and json as default data format', (done) => {

        editedItemStatusRef = modifyItemStatus(newItemRef)

        chai.request(app)
          .put('/orders/' + newItemRef.id + '/status')
          .set('Authorization', tokens.admin)
          .send(editedItemStatusRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('status').to.be.equal(editedItemStatusRef.status)

            done()
          })
      })
    })
  })

})

function createNewItem() {
  let categoryList = ['Pizzas', 'Bebidas', 'Hamburguesas', 'Ensaladas']
  let gender = faker.random.boolean()

  let buyedItemsCount = faker.random.number(4) + 1
  let buyedItems = []
  let buyedItemsTotal = 0

  for (let i = 0; i < buyedItemsCount; i++) {
    let generatedItem = {
      'title': faker.random.words(3),
      'image': faker.image.food(800),
      'description': faker.lorem.paragraph(),
      'price': faker.random.number(24) + 1,
      'category': faker.random.arrayElement(categoryList),
      'quantity': faker.random.number(3) + 1
    }

    buyedItems.push(generatedItem)

    buyedItemsTotal += (generatedItem.price * generatedItem.quantity)

  }

  return {
    'user': {
      'id': 2,
      'firstname': faker.name.firstName(gender),
      'lastname': faker.name.lastName(gender),
      'address': faker.address.streetAddress(true),
      'phone': faker.phone.phoneNumber()
    },
    'created_at': faker.date.recent(),
    'products': buyedItems,
    'total': buyedItemsTotal,
    'status': 1,
    'shipped_at': null
  }
}

function modifyItemStatus(item) {
  let statusList = [2, 3] //1 pending, 2 shipped, 3 cancelled

  let statusItem = { status: faker.random.arrayElement(statusList) }

  return statusItem
}

function modifyItem(item) {
  let statusList = [2, 3] //1 pending, 2 shipped, 3 cancelled

  item.user.address = faker.address.streetAddress(true)
  item.status = faker.random.arrayElement(statusList)
  item.shipped_at = faker.date.recent()

  return item
}
