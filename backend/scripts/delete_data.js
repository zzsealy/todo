const mongoose = require('mongoose')
const URL = "mongodb://todo_admin:drq12345!@localhost:27017/todo"

mongoose.connect(URL);
const db = mongoose.connection;

const todoListModel = require('../models/todoList')
const todoModel = require('../models/todo')

const f = async () => {
    const a = await todoListModel.deleteMany({})
    const b = await todoModel.deleteMany({})
    console.log('执行成功')
}

f()
