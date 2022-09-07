import express from 'express'
const app = express()

require('./startup/routes')(app)

const port = process.env.PORT
app.listen(port, () => console.log(`Listening on port ${port}...`))