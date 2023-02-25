
const todoRouter = require('express').Router()
const config = require('../utils/config')

const todoListModel = require('../models/todoList')
const todoModel = require('../models/todo')

todoRouter.get('/todo_lists/:id', async (request, response) => {
        const todoList = await todoListModel.findById(request.params.id).populate('childTodo')

        const finishDateString = todoList.finishDate.toLocaleString();
        const dateSplit = finishDateString.split(',')[0].split('/');
        const dateString = `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;

        return response.status(200).json({'code':200, 'todoList': todoList, 'dateString': dateString})
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
        
        return response.status(200).json({'code':200, 'todoList': todoListSave })
})

const getFinishRate = (totalTodo) => {
        const allTodoNum = totalTodo.length;
        let finishNum = 0
        totalTodo.map(todo => {
                if (todo.isFinish) {
                        finishNum += 1
                }
        })
        return String(finishNum) + '/' + String(allTodoNum)
}

todoRouter.put('/todo_lists/:id', async (request, response) => {
        let { type } = request.body
        if (type === 'close') {
            const todoList = await todoListModel.findById(request.params.id).populate('childTodo')
            todoList.canChange = false;
            todoList.finishDate = Date();
            todoList.closeDateTime = Date()
            todoList.finishRate = getFinishRate(todoList.childTodo)
            const todoListSave = await todoList.save()
            return response.status(200).json({'code':200, 'todoList': todoListSave})
                
        }
        if (type === 'del') {
            const delResult = await todoListModel.findByIdAndDelete(request.params.id)
            if (delResult) {
                    return response.status(200).json({'code':200})
            }
        }
})

const chunkTodoList = (todoLists, page) => {
        // 以12个为一页切片
        return todoLists.slice(12*(page-1), 12*page)
}

todoRouter.get('/todo_lists', async (request, response) => {
       
        const userInfo = request.userInfo
        const currentPage = Number(request.query.page)
        const todoLists = await todoListModel.find({'userId': userInfo.userId}).populate('childTodo').sort('-createDateTime')
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
        const todoListNum = newTotoLists.length
        return response.status(200).json({'code': 200 , 'todoList': chunkTodoList(newTotoLists, currentPage), "todoListNum": todoListNum })
})


todoRouter.post('/todo_lists', async (request, response) => {
        // const a = await todoListModel.deleteMany({})
        const { title, dateString } = request.body;
        if (title && dateString) {
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
        } else {
                return response.status(200).json({"code": 400})
        }
})


todoRouter.put('/todo/:id', async (request, response) => {
        const todo = await todoModel.findById(request.params.id)
        todo.isFinish = !todo.isFinish
        const saveTodo = await todo.save()
        return response.status(200).json({"code": 200, 'todo': saveTodo})
})



module.exports = todoRouter