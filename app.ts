import express from 'express'
const app = express()

require('./startup/logger')
require('./startup/routes')(app)
require('./startup/prod')(app)

const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Listening on port ${port}...`))