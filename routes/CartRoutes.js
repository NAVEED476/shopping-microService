const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./VerifyToken");
const Cart = require("../Models/CartSchema");
const cartRoutes = require("express").Router();

// create
cartRoutes.post("/", verifyToken, async (req, res) => {
  const cartProduct = new Cart(req.body);

  try {
    const cartItem = await cartProduct.save();
    res.status(200).json(cartItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update cart
cartRoutes.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
      const updatedCartItem = await Cart.findByIdAndUpdate(
        req.body.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedCartItem);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

// delete cartItem
cartRoutes.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("cart item deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get cart
cartRoutes.get("/find/:id",verifyTokenAndAuthorization,async(req,res)=>{
    try{
        const cartItem = await Cart.findOne(req.params.id)
        res.status(200).json(cartItem)
    }catch(err){
        res.status(500).json(err)
    }
})

//get all cart Items 

cartRoutes.get("/",verifyTokenAndAdmin, async(req,res)=>{
    try{
        const cartItems = await Cart.find();
        res.status(200).json(cartItems)
    }catch(err){
        res.status(500).json(err)
    }
})




module.exports = cartRoutes;
