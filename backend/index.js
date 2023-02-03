const express = require('express')
const cors = require('cors')
require('dotenv').config()
const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(cors())


app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/ping', (request, response) => {
    response.json('pong')
})

console.log('PORT++++++++', PORT)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})