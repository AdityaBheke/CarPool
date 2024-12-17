const jwt = require('jsonwebtoken');
const { customError } = require('./errorhandler.middleware');

const auth = (req, res, next)=>{
    const {cookie} = req.headers;
    if (!cookie) {
        throw new customError(400, 'Bad request Token not available');
    }
    
    const token = cookie?.split('; ')?.filter((c)=> c.includes('jwtToken'))?.[0]?.replace('jwtToken=','');
    if (!token) {
        throw new customError(400, 'Bad request Token not available')
    }
    try {
        const payload = jwt.verify(token, 'secret');
        req.userId = payload.userId;
    } catch (error) {
        throw new customError(400, 'Token expired')
    }
    next()
}

module.exports = auth;