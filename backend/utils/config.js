require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

const SALT_ROUNDS = process.env.SALT_ROUNDS 
const TOKEN_KEY = process.env.TOKEN_KEY 

module.exports = {
    MONGODB_URI,
    PORT,
    SALT_ROUNDS,
    TOKEN_KEY
}