const mongo_db = require('./db/mongodb/mongo_db.js')
// import router from './routes/index.js'
const express = require('express')
const cors = require('cors')
const usersRouter = require('./controller/user')

const app = express()
app.use(express.json())
app.use(cors())
app.use('/user', usersRouter)


app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/ping', (request, response) => {
    response.json('pong')
})

module.exports = app