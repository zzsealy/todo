const userModel = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('login', (request, response) => {
    const { username, password } = request.body
    const findData = {'username': username}
    userModel.findOne({findData})
})


usersRouter.post('register', (request, response) => {
    const { username, password, passwordRepeat } = request.body;

})

module.exports = usersRouter