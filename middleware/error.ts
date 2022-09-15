import logger from '../startup/logger'
import { Request, Response, NextFunction } from 'express'

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(err.message, err)
  res.status(500).send({'message': 'Something failed.'})
  next()
}