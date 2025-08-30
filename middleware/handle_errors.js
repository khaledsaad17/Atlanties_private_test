const logger = require('../utils/logger');
const error = (err,req,res,next)=>{
    console.log(err.message);
    logger.error("khaled is here")
    next()
}
module.exports = error