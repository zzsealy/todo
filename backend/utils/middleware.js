const logger = require('./logger')
const jwt = require('jsonwebtoken')

const userModel = require('../models/user')
const getTokenForm = require('../utils/common_func').getTokenForm
const config = require('../utils/config')

const notNeedTokenUrl = {
  '/user/login': ['GET', 'POST'],
  '/user/register': ['GET', 'POST']
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}


const verifyToken = async (request, response, next) => {

  let notNeedTokenMethod = false
  const notNeedToken = request.path in notNeedTokenUrl
  if (notNeedToken) {
    let a = notNeedTokenUrl[request.path]
    notNeedTokenMethod = a.find(method => method === request.method)
    console.log('notNeedTokenMethod')
  }
  if (notNeedTokenMethod) {

  } else {
    const token = getTokenForm(request)
    if (token) {
      try {
        const decodedToken = jwt.verify(token, config.TOKEN_KEY)
        const user_id = decodedToken.user_id
        const findUser = await userModel.findById(user_id).exec();
        const userInfo = { 'userName': findUser.username, 'userId': findUser.id , 'name': findUser.name}
        request.userInfo = userInfo
        console.log(userInfo)
      } catch (error) {
        next(error)
      }
    } else {
      return response.status(200).json({ 'code': 401 })
    }
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(200).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(200).json({
      'code': 401
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  verifyToken,
}