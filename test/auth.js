'use strict'

let app = require('../app.js')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

const validCredentials = {
  'email': 'juanma@test.es',
  'password': 'test'
}

const invalidCredentials = {
  'email': 'test@test.es',
  'password': 'testeando'
}

const existingEmail = {email: 'juanma@test.es'}
const nonExistingEmail = {email: 'test@test.com'}

describe('auth', () => {
  describe('LOGIN', () => {

    it('Should return with valid credentials status 200 and json as default data format', (done) => {

      chai.request(app)
        .post('/auth/login')
        .send(validCredentials)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          //1. comprobamos
          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property('token').to.be.a('string')


          //2. marcamos como finalizado el test
          done()
        })

    })

    it('Should return with invalid credentials status 401 and json as default data format', (done) => {

      chai.request(app)
        .post('/auth/login')
        .send(invalidCredentials)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          //1. comprobamos
          expect(res).to.have.status(401)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.not.have.property('token')
          expect(res.body).to.have.property('message')

          //2. marcamos como finalizado el test
          done()
        })

    })


  })

  describe('FORGOTTEN-PASSWORD', () => {

    it('Should return with existing email status 200 and json as default data format', (done) => {

      chai.request(app)
        .post('/auth/forgotten-password')
        .send(existingEmail)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          //1. comprobamos la respuesta
          expect(res).to.have.status(200)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('message')

          //2. marcamos como finalizado el test
          done()
        })

    })

    it('Should return with non existing email status 404 and json as default data format', (done) => {

      chai.request(app)
        .post('/auth/forgotten-password')
        .send(nonExistingEmail)
        .end((err, res) => {

          if (err) {
            console.error(err)
            done()
          }

          //1. comprobamos la respuesta
          expect(res).to.have.status(404)
          expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
          expect(res.body).to.have.property('message')

          //2. marcamos como finalizado el test
          done()
        })

    })

  })

})
