import mongo_db from './db/mongodb/mongo_db.js'

import express, { json } from 'express'
import cors from 'cors'
import "dotenv/config.js";
const PORT = process.env.PORT

const app = express()
app.use(json())
app.use(cors())


app.get('/', (request, response) => {
    response.send('<h1>Hello World </h1>')
})

app.get('/ping', (request, response) => {
    response.json('pong')
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})