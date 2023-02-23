
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
        // todoLists.forEach(todoList => {
        //         const finishDateString = todoList.finishDate.toLocaleString();
        //         const dateSplit = finishDateString.split(',')[0].split('/');
        //         const dateString = `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
        //         todoList.dateString = dateString;
        // });
        const newTotoLists = []
        todoLists.map(todoList => {
                const finishDateString = todoList.finishDate.toLocaleString();
                const dateSplit = finishDateString.split(',')[0].split('/');
                const dateString = `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
                todoList.finishDate = dateString;
                const newTodoList = {
                        "finishDate": dateString,
                        "title": todoList.title,
                        "id": todoList.id,
                        "childTodo": todoList.childTodo,
                        "canChange": todoList.canChange,
                        "closeDateTime": todoList.closeDateTime
                }
                newTotoLists.push(newTodoList)
        })
        return response.status(200).json({'code': 200 , 'todoList': newTotoLists})
})


todoRouter.post('/todo_lists', async (request, response) => {
        // const a = await todoListModel.deleteMany({})
        const { title, dateString } = request.body;
        const userInfo = request.userInfo
        const finishDate = new Date(dateString.replace('-', '/'))
        const todoList = new todoListModel({
                userId: userInfo.userId,
                title: title,
                finishDate: finishDate,
                childTodo: [],
                createDateTime: Date(),
                canChange: true,
                
        })
        const saveTodoList = await todoList.save()
        return response.status(200).json({ "code": 200, "saveData": "saveTodoList" })
})


todoRouter.put('/todo/:id', async (request, response) => {
        const todo = await todoModel.findById(request.params.id)
        todo.isFinish = !todo.isFinish
        const saveTodo = await todo.save()
        return response.status(200).json({"code": 200, 'todo': saveTodo})
})



module.exports = todoRouter