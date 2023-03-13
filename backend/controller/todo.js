
const todoRouter = require('express').Router()
const config = require('../utils/config')

const todoListModel = require('../models/todoList')
const todoModel = require('../models/todo')

todoRouter.get('/todo_lists/:id', async (request, response) => {
        const todoList = await todoListModel.findById(request.params.id).populate('childTodo')

        const finishDateString = todoList.finishDate.toLocaleString();
        const dateSplit = finishDateString.split(',')[0].split('/');
        const dateString = `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
        const tag = todoList.tag;

        return response.status(200).json({'code':200, 'todoList': todoList, 'dateString': dateString, 'tag': tag})
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
        let { type, tag } = request.body
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
        if (type === 'tag') {
            const todoList = await todoListModel.findById(request.params.id).populate('childTodo')
            todoList.tag = tag;
            const todoListSave = await todoList.save()
            return response.status(200).json({'code':200, 'todoList': todoListSave})
        }

})

const chunkTodoList = (todoLists, page) => {
        // 以12个为一页切片
        return todoLists.slice(12*(page-1), 12*page)
}

todoRouter.get('/todo_lists', async (request, response) => {
       
        const userInfo = request.userInfo
        const currentPage = Number(request.query.page)
        const tag = request.query.tag
        const status = request.query.status
        const todoLists = await todoListModel.find({'userId': userInfo.userId}).populate('childTodo').sort('-createDateTime')
        // todoLists.forEach(todoList => {
        //         const finishDateString = todoList.finishDate.toLocaleString();
        //         const dateSplit = finishDateString.split(',')[0].split('/');
        //         const dateString = `${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`;
        //         todoList.dateString = dateString;
        // });
        let newTotoLists = []
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
                        "closeDateTime": todoList.closeDateTime,
                        "tag": todoList.tag
                }
                newTotoLists.push(newTodoList)
        })
        if (tag) {
            const tagFilteredTodoLists = newTotoLists.filter(todoList => todoList.tag===tag)
            newTotoLists = tagFilteredTodoLists
        }
        if (status) {
            if (status === 'process') { // 进行中
                const statusFilterTodoLists = newTotoLists.filter(todoList => todoList.canChange === true)
                newTotoLists = statusFilterTodoLists
            }
            if (status === 'finish') { //已经关闭
                const statusFilterTodoLists = newTotoLists.filter(todoList => todoList.canChange === false)
                newTotoLists = statusFilterTodoLists
            }
        }
        const todoListNum = newTotoLists.length
        return response.status(200).json({'code': 200 , 'todoList': chunkTodoList(newTotoLists, currentPage), "todoListNum": todoListNum })
})

// 创建todoList
todoRouter.post('/todo_lists', async (request, response) => {
        // const a = await todoListModel.deleteMany({})
        /*
          params: 
            tag:
              short:短期目标 
              long:长期目标 
              week: 周目标 
              month:月目标
        */
        const { title, dateString, tag } = request.body;
        if (title && dateString && tag) {
                const userInfo = request.userInfo
                const finishDate = new Date(dateString.replace('-', '/'))
                const todoList = new todoListModel({
                        userId: userInfo.userId,
                        title: title,
                        finishDate: finishDate,
                        childTodo: [],
                        createDateTime: Date(),
                        canChange: true,
                        tag: tag,
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