const logger = require('./logger')

const validateBearerToken = function(req,res,next){
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
  console.log(authToken,'authtoken',apiToken,'apitoken')
  if(!authToken ||authToken.split(' ')[1]!==apiToken){
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({error:'Unautherized request'})
  }
  next()
}

module.exports = validateBearerToken