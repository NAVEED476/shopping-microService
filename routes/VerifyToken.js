const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
    const token = req.params.token
  if (authHeader) {
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(401).json("token is inValid !");
      req.user = user;
    });
  } else {
    return res.status(403).json("you are not authenticated");
  }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("you are not allowed to do that")
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization };
