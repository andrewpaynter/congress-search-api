import express from 'express'
import cors from 'cors'
import ExpressApp from '../models/ExpressApp'
const congress = require( '../routes/congress')
const img = require( '../routes/img')


module.exports = function (app: ExpressApp) {
  app.use(express.json())
  app.use(cors({ origin: 'https://congress-searcher.herokuapp.com', credentials: true, exposedHeaders: 'finalItem,Content-Type'}))

  app.use('/api/congress', congress)
  app.use('/api/img', img)
}
