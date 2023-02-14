
const todoRouter = require('express').Router()
const config = require('../utils/config')

const todoListModel = require('../models/todoList')

todoRouter.get('/todo_lists/:id', async (request, response) => {
        const todoList = await todoListModel.findById(request.params.id)
        return response.status(200).json({'code':200, 'todoList': todoList})
})

todoRouter.get('/todo_lists', async (request, response) => {
        // const user = await User.findById(decodedToken.id)

        // const note = new Note({
        // content: body.content,
        // important: body.important === undefined ? false : body.important,
        // user: user._id
        // })

        // const savedNote = await note.save()
        // user.notes = user.notes.concat(savedNote._id)
        // await user.save()
        // const todoLists = await todoListModel.find({'userId': userInfo.userId}).populate('childTodo')
        const userInfo = request.userInfo
        const todoLists = await todoListModel.find({'userId': userInfo.userId})
        return response.status(200).json({'code': 200 , 'todoList': todoLists})
})


todoRouter.post('/todo_lists', async (request, response) => {
        const a = await todoListModel.deleteMany({})
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



module.exports = todoRouter