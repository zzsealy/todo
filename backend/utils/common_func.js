const jwt = require('jsonwebtoken')

const getTokenForm = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

module.exports = {
    getTokenForm
}