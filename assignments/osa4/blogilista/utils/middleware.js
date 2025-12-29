const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')

    if(authorization && authorization.startsWith('Bearer')) {
        request.token = authorization.replace('Bearer ', '')
    } else {
        request.token = null
    }

    next()
}

module.exports = {
    tokenExtractor
}
//4.20 tein jo nain