
const todoRouter = require('express').Router()
const config = require('../utils/config')

const todoListModel = require('../models/todoList')
const todoModel = require('../models/todo')

todoRouter.get('/todo_lists/:id', async (request, response) => {
        const todoList = await todoListModel.findById(request.params.id).populate('childTodo')
        return response.status(200).json({'code':200, 'todoList': todoList})
})

todoRouter.post('/todo_lists/:id', async (request, response) => {
        const todoList = await todoListModel.findById(request.params.id)
        let { todoContent } = request.body
        const Todo = new todoModel({
                content: todoContent,
                isFinish: false,
                createDateTime: Date()

        })
        const saveTodo = await Todo.save()
        todoList.childTodo = todoList.childTodo.concat(saveTodo._id)
        const todoListSave = await todoList.save()
        return response.status(200).json({'code':200, 'todoList': todoListSave})
})

todoRouter.get('/todo_lists', async (request, response) => {
       
        const userInfo = request.userInfo
        const todoLists = await todoListModel.find({'userId': userInfo.userId}).populate('childTodo')
        return response.status(200).json({'code': 200 , 'todoList': todoLists})
})


todoRouter.post('/todo_lists', async (request, response) => {
        // const a = await todoListModel.deleteMany({})
        const userInfo = request.userInfo
        const todoList = new todoListModel({
                userId: userInfo.userId,
                childTodo: [],
                createDateTime: Date(),
                canChange: true
        })
        const saveTodoList = await todoList.save()
        return response.status(200).json(saveTodoList)
})


todoRouter.put('/todo/:id', async (request, response) => {
        const todo = await todoModel.findById(request.params.id)
        todo.isFinish = !todo.isFinish
        const saveTodo = await todo.save()
        return response.status(200).json({"code": 200, 'todo': saveTodo})
})



module.exports = todoRouter