const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
    
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(401).json("token is inValid !");
      req.user = user;
      next();
    });
  } else {
    return res.status(403).json("you are not authenticated");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
      console.log("req.user.id:", req.user.id);
      console.log("req.params.id:", req.params.id);
      console.log("req.user.isAdmin:", req.user.isAdmin);

      if (req.user.id === req.params.id || req.user.isAdmin) {
          next();
      } else {
          console.log("Access denied");
          res.status(403).json("You are not allowed to do that");
      }
  });
};

const verifyTokenAndAdmin = (req,res,next)=>{
  verifyToken(req,res,()=>{
      if(req.user.isAdmin){
          next();
      }else{
          res.status(403).json("you are not allowed to do that")
      }
  })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
