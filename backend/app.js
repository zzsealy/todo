const mongo_db = require('./db/mongodb/mongo_db.js')
// import router from './routes/index.js'
const express = require('express')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const cors = require('cors')
const usersRouter = require('./controller/user')
const todoRouter = require('./controller/todo')

const app = express()
app.use(cors())
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.verifyToken)

app.use('/api/user', usersRouter)
app.use('/api/todo', todoRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/ping', (request, response) => {
    response.json('pong')
})

module.exports = app