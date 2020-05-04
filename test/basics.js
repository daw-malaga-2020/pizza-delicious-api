'use strict'

const chai = require('chai')
const expect = chai.expect

const app = require('../app.js')

describe('App', () => {
  describe('EXISTS', () => {
    it('Should return a valid express server instance', (done) => {

        expect(app).to.be.a('function');

        done();
    })
  })

})
