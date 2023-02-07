const bcrypt = require('bcrypt')

const userModel = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.post('login', (request, response) => {
    const { username, password } = request.body
    const findData = {'username': username}
    userModel.findOne({findData})
})


usersRouter.post('/register', async (request, response) => {

    const { username, password, passwordRepeat } = request.body;
    // const findData = 
    if (password === passwordRepeat) {  // 如果两次密码输入一样
        const findUser = await userModel.find({ 'username': username })
        if (findUser.length) {
            console.log('存在')
            return response.status(200).json({ 'code': 402, 'message': '用户已经存在' })
        } else {
            const user = new userModel({
                username,
                password
            })
            const saveUser = user.save()
            // saveUser.code = 200
            return response.status(200).json({'code': 200})
        }
    } else {
        return response.status(200).json({'code': 402, 'message': '两次密码输入不一致'})
    }
})

module.exports = usersRouter