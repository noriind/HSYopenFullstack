const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require ('../models/user')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if(authorization && authorization.startsWith('Bearer')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }

    next()
}

//step 10
const userExtractor = async (request, response, next) => {
    try {
        if(!request.token){
            return response.status(401).json({error: 'token missing'})
        }

        const decodedToken = jwt.verify(request.token, config.SECRET)

        if(!decodedToken.id){
            return response.status(401).json({ error: 'token invalid'})
        }

        request.user = await User.findById(decodedToken.id)

        next()
    }   catch (exception) {
        next(exception)  
    }
}

module.exports = {
    tokenExtractor,
    userExtractor
}
//4.20 tein jo nain