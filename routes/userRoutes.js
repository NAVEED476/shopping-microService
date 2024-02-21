const userRoute = require("express").Router();

userRoute.get("/hello",(req,res)=>{
    res.send("hello mawa")
})
userRoute.post("/userdetails",async(req,res)=>{
    let {name,email, number, password} = await req.body
    res.json(name)
})

module.exports = userRoute;