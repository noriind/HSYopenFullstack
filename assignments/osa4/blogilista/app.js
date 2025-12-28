const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
//4.15
app.use('/api/users', usersRouter)
//4.18
app.use('/api/login', loginRouter)


//4.12
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  //4.13
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } //4.16
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key')) {
    return response.status(400).json({ error: 'expected `username` to be unique'})
  } //4.18
  else if (error.name === 'JsonWebTokenError'){
    return response.status(401).json({ error: 'invalid token'})
  }

  next(error)
}

app.use(errorHandler)

module.exports = app