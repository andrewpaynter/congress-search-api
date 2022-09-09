import express, {Request, Response, NextFunction} from 'express'
import cors from 'cors'

const congress = require('../routes/congress')

module.exports = function (app: Express.Application) {
  app.use(express.json())
  app.use(cors({ origin: ['http://localhost:3000'], credentials: true}))

  app.use('/api/congress', congress)
}
