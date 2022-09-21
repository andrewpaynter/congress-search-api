import helmet from 'helmet'
import compression from 'compression'
import ExpressApp from '../models/ExpressApp'

module.exports = function(app: ExpressApp) {
  app.use(helmet())
  app.use(compression)
}