const jwt = require('jsonwebtoken')

const todoRouter = require('express').Router()
const getTokenForm = require('../utils/common_func').getTokenForm
const config = require('../utils/config')

todoRouter.get('/todo_lists', async (request, response) => {
        return response.status(200).json({'code': 200 })
})




module.exports = todoRouter