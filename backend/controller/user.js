const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken')

const userModel = require('../models/user')
const usersRouter = require('express').Router()
const config = require('../utils/config')
const saltRounds = config.SALT_ROUNDS

usersRouter.post('login', (request, response) => {
    const { username, password } = request.body
    const findData = {'username': username}
    userModel.findOne({findData})
})


usersRouter.post('/register', async (request, response) => {

    let { username, password, passwordRepeat, name } = request.body;
    // const findData = 
    if (password === passwordRepeat) {  // 如果两次密码输入一样
        const findUser = await userModel.find({ 'username': username })
        if (findUser.length) {
            console.log('存在')
            return response.status(200).json({ 'code': 1001, 'message': '用户已经存在' })
        } else {
            const passwordHash = await bcrypt.hash(password, Number(saltRounds))
            const user = new userModel({
                username: username,
                password: passwordHash,
                name: name
            })
            const saveUser = user.save()
            // saveUser.code = 200
            return response.status(200).json({'code': 200})
        }
    } else {
        return response.status(200).json({'code': 402, 'message': '两次密码输入不一致'})
    }
})

usersRouter.post('/login', async (request, response) => {
    let { username, password } = request.body;
    const user = await userModel.findOne({ 'username': username })
    if (user) {
        bcrypt.compare(password, user.password)
            .then(result => {
                console.log(result)
                // expiresIn: "10h" // it will be expired after 10 hours
                //expiresIn: "20d" // it will be expired after 20 days
                //expiresIn: 120 // it will be expired after 120ms
                //expiresIn: "120s" // it will be expired after 120s
                const token = jwt.sign({user_id: user.id},  process.env.TOKEN_KEY, {expiresIn: "10s"})
                return response.status(200).json({ 'code': 200, 'token': token })
            })
            .catch(error => {
                console.log(error)
                return response.status(200).json({ 'code': 400 })
            })
    }
})

module.exports = usersRouter