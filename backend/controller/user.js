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
    const findUser = await userModel.find({ 'username': username })
    if (findUser.length) {
        console.log('存在')
        return response.status(200).json({'message': '已存在'})
    } else {
        const user = new userModel({
            username,
            password
        })
        const saveUser = user.save()
        return response.status(200).json(saveUser)
    }
    
})

module.exports = usersRouter