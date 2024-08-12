const jwt = require('jsonwebtoken');
require ('dotenv').config();

const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization;
  if(!auth){
    res.status(401).json({status:401, message:"1No autorizado"})
  }

  const token = auth.split(" ")[1];
  if(!token){
    res.status(401).json({status:401, message:"2No autorizado"})
  }
  jwt.verify(token, process.env.SECRET_KEY, (error)=>{
    if(error){
      res.status(401).json({status:401, message:"3No autorizado"})
    }
  })

  next();
}

module.exports = verifyToken;