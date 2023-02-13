
const todoRouter = require('express').Router()
const config = require('../utils/config')

const todoListModel = require('../models/todoList')

todoRouter.get('/todo_lists', async (request, response) => {
        const userInfo = request.userInfo
        const todoLists = await todoListModel.find({'user_id': userInfo.userId})
        return response.status(200).json({'code': 200 , 'todoList': todoLists})
})


todoRouter.post('/todo_lists', async (request, response) => {
        return response.status(200).json({'code': 200})
})



module.exports = todoRouter