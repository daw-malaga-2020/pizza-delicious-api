'use strict'

const faker = require('faker')
const slugify = require('slugify')

let app = require('../app.js')
let tokens = require('./conf/tokens')

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

chai.use(chaiHttp)

let newItemRef = null
let editedItemRef = null

describe('articles', () => {
  describe('LIST', () => {
    describe('AS ANONYMOUS', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/articles')
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

    describe('AS USER', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/articles')
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
          .get('/articles')
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
          .post('/articles')
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
      it('Should return status 403 and json as default data format', (done) => {

        newItemRef = createNewItem()

        chai.request(app)
          .post('/articles')
          .set('Authorization', tokens.user)
          .send(newItemRef)
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

    describe('AS ADMIN', () => {
      it('Should return status 201 and json as default data format', (done) => {

        newItemRef = createNewItem()

        chai.request(app)
          .post('/articles')
          .set('Authorization', tokens.admin)
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
            expect(res.body).to.have.property('title').to.be.equal(newItemRef.title)
            expect(res.body).to.have.property('slug').to.be.equal(newItemRef.slug)
            expect(res.body).to.have.property('excerpt').to.be.equal(newItemRef.excerpt)
            expect(res.body).to.have.property('image').to.be.equal(newItemRef.image)
            expect(res.body).to.have.property('publish_at')
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            //2. guardamos el resultado para siguientes test
            newItemRef = res.body

            //2. marcamos como finalizado el test
            done()
          })
      })
    })


  })

  describe('GET', () => {
    describe('AS ANONYMOUS', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/articles/' + newItemRef.id)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('title').to.be.equal(newItemRef.title)
            expect(res.body).to.have.property('slug').to.be.equal(newItemRef.slug)
            expect(res.body).to.have.property('excerpt').to.be.equal(newItemRef.excerpt)
            expect(res.body).to.have.property('image').to.be.equal(newItemRef.image)
            expect(res.body).to.have.property('publish_at')
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            done()
          })
      })
    })

    describe('AS USER', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/articles/' + newItemRef.id)
          .set('Authorization', tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('title').to.be.equal(newItemRef.title)
            expect(res.body).to.have.property('slug').to.be.equal(newItemRef.slug)
            expect(res.body).to.have.property('excerpt').to.be.equal(newItemRef.excerpt)
            expect(res.body).to.have.property('image').to.be.equal(newItemRef.image)
            expect(res.body).to.have.property('publish_at')
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        chai.request(app)
          .get('/articles/' + newItemRef.id)
          .set('Authorization', tokens.admin)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(200)
            expect(res).to.have.header('Content-type', 'application/json; charset=utf-8')
            expect(res.body).to.have.property('id').to.be.equal(newItemRef.id)
            expect(res.body).to.have.property('title').to.be.equal(newItemRef.title)
            expect(res.body).to.have.property('slug').to.be.equal(newItemRef.slug)
            expect(res.body).to.have.property('excerpt').to.be.equal(newItemRef.excerpt)
            expect(res.body).to.have.property('image').to.be.equal(newItemRef.image)
            expect(res.body).to.have.property('publish_at')
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
          .put('/articles/' + newItemRef.id)
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
      it('Should return status 403 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/articles/' + newItemRef.id)
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
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', (done) => {

        editedItemRef = modifyItem(newItemRef)

        chai.request(app)
          .put('/articles/' + newItemRef.id)
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
            expect(res.body).to.have.property('title').to.be.equal(newItemRef.title)
            expect(res.body).to.have.property('slug').to.be.equal(newItemRef.slug)
            expect(res.body).to.have.property('excerpt').to.be.equal(newItemRef.excerpt)
            expect(res.body).to.have.property('image').to.be.equal(newItemRef.image)
            expect(res.body).to.have.property('publish_at')
            expect(res.body).to.have.property('enabled').to.be.equal(newItemRef.enabled)

            done()
          })
      })
    })
  })


  describe('DELETE', () => {

    describe('AS ANONYMOUS', () => {
      it('Should return status 401 and json as default data format', function (done) {

        chai.request(app)
          .delete('/articles/' + newItemRef.id)
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
      it('Should return status 403 and json as default data format', function (done) {

        chai.request(app)
          .delete('/articles/' + newItemRef.id)
          .set('Authorization',tokens.user)
          .end((err, res) => {

            if (err) {
              console.error(err)
              done()
            }

            expect(res).to.have.status(403)
            expect(res.body).to.have.property('message')

            done()
          })
      })
    })

    describe('AS ADMIN', () => {
      it('Should return status 200 and json as default data format', function (done) {

        chai.request(app)
          .delete('/articles/' + newItemRef.id)
          .set('Authorization',tokens.admin)
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
  let categoryList = ['Novedades', 'Ofertas', 'Gastronomía', 'I + D']
  let tagList = ['Pizzas', 'Hamburguesas', 'Foodies', 'Roma', 'Trending', 'IA foodtech']

  let title = faker.random.words(4)

  return {
    'title': title,
    'slug': slugify(title, { lower: true }),
    'image': faker.image.cats(800),
    'excerpt': faker.lorem.sentences(4),
    'body': faker.lorem.paragraphs(4),
    'publish_at': faker.date.recent(),
    'categories': [
      faker.random.arrayElement(categoryList),
      faker.random.arrayElement(categoryList)
    ],
    'tags': [
      faker.random.arrayElement(tagList),
      faker.random.arrayElement(tagList),
      faker.random.arrayElement(tagList),
      faker.random.arrayElement(tagList)
    ],
    'author': faker.name.findName + ' ' + faker.name.lastName,
    'enabled': true
  }
}

function modifyItem(item) {
  item.price = faker.random.number(24) + 1
  item.image = faker.image.animals(1024)
  item.enabled = faker.random.boolean()

  return item
}
