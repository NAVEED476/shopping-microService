const { verifyTokenAndAuthorization } = require("./VerifyToken");

const userRoute = require("express").Router();

// UPDATE
userRoute.put("/:id", verifyTokenAndAuthorization,(req,res)=>{

})


module.exports = userRoute;