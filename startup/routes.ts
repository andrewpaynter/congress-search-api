import express from 'express'
import cors from 'cors'
const congress = require( '../routes/congress')
const img = require( '../routes/img')


module.exports = function (app: Express.Application) {
  app.use(express.json())
  app.use(cors({ origin: ['http://localhost:3000'], credentials: true}))

  app.use('/api/congress', congress)
  app.use('/api/img', img)
}
