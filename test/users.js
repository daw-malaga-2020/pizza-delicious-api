'use strict'

const faker = require('faker')
const jwt = require('jsonwebtoken')
const config = require('../modules/config')

let app = require('../app.js')
let tokens = require('./conf/tokens')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

let getUserId = 2
let newItemRef = null
let editedItemRef = null

describe('users', () => {
  describe('LIST', () => {

    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        chai.request(app)
          .get('/users')
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
      it('Should return status 403 and json as default data format', (done) => {

        chai.request(app)
          .get('/users')
          .set('Authorization', tokens.user)
          .end((err, res) => {

            //1. comprobamos
            expect(res).to.have.status(403)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('message')

            //2. marcamos como finalizado el test
            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/users')
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

    it('Should return status 201 and json as default data format', (done) => {

      newItemRef = createNewItem()

      chai.request(app)
        .post('/users')
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
          expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
          expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
          expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
          expect(res.body).to.not.have.property('password')
          expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
          expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
          expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
          expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

          //2. guardamos el resultado para siguientes test
          newItemRef = res.body

          //2. marcamos como finalizado el test
          done()
        })
    })

  })

  describe('GET', () => {
    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', (done) => {

        chai.request(app)
          .get('/users/' + newItemRef.id)
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
          .get('/users/' + getUserId)
          .set('Authorization', tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(getUserId)

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/users/' + newItemRef.id)
          .set('Authorization', tokens.admin)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
            expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
            expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
            expect(res.body).to.not.have.property('password')
            expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
            expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
            expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

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
          .put('/users/' + newItemRef.id)
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
    })

    describe('AS USER', () => {
      it('Should return status 200 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/users/' + getUserId)
          .set('Authorization', tokens.user)
          .send(editedItemRef)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(getUserId)
            expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
            expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
            expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
            expect(res.body).to.not.have.property('password')
            expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
            expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
            expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/users/' + newItemRef.id)
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
            expect(res.body).to.have.property('firstname').to.be.equal(newItemRef.firstname)
            expect(res.body).to.have.property('lastname').to.be.equal(newItemRef.lastname)
            expect(res.body).to.have.property('email').to.be.equal(newItemRef.email)
            expect(res.body).to.not.have.property('password')
            expect(res.body).to.have.property('address').to.be.equal(newItemRef.address)
            expect(res.body).to.have.property('phone').to.be.equal(newItemRef.phone)
            expect(res.body).to.have.property('profile').to.be.equal(newItemRef.profile)
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            newItemRef = res.body

            done()
          })
      })
    })

  })


  describe('DELETE', () => {
    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', function (done) {

        chai.request(app)
          .delete('/users/' + newItemRef.id)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(401)
            expect(res.body).to.have.property('message')

            done()
          })
      })
    })

    describe('AS USER', () => {

      it('Should return status 404 and json as default data format (distinct user)', function (done) {

        chai.request(app)
          .delete('/users/' + newItemRef.id)
          .set('Authorization', tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(404)
            expect(res.body).to.have.property('message')

            done()
          })
      })

      it('Should return status 200 and json as default data format', function (done) {

        chai.request(app)
          .delete('/users/' + getUserId)
          .set('Authorization', tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(204)
            expect(res.body).to.be.empty

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', function (done) {

        chai.request(app)
          .delete('/users/' + newItemRef.id)
          .set('Authorization', tokens.admin)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(204)
            expect(res.body).to.be.empty

            done()
          })
      })
    })

  })
})

function createNewItem() {

  let gender = faker.random.boolean()

  return {
    'firstname': faker.name.firstName(gender),
    'lastname': faker.name.lastName(gender),
    'email': faker.internet.email(),
    'password': 'test',
    'address': faker.address.streetAddress(true),
    'phone': faker.phone.phoneNumber(),
    'profile': faker.random.arrayElement(['user']),
    'enabled': true
  }
}

function modifyItem(item) {
  item.enabled = faker.random.boolean()
  item.profile = faker.random.arrayElement(['user', 'admin'])
  item.password = faker.internet.password(8)
  item.address = faker.address.streetAddress(true)
  item.phone = faker.phone.phoneNumber()

  return item
}

function createUserValidToken(userData) {
  let payload = {
    id: userData.id,
    firstname: userData.firstName,
    profile: userData.profile
  }

  return jwt.sign(payload, config.APP_SECRET, {
    expiresIn: config.APP_TOKEN_VALIDITY_IN_DAYS + ' days'
  })
}

function getTokenData(token) {
  return jwt.verify(token, config.APP_SECRET)
}
