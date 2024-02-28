const Users = require("../Models/userSchema");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./VerifyToken");
const CryptoJS = require("crypto-js");

const userRoute = require("express").Router();

// UPDATE
userRoute.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  //   console.log("hello");

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.SEC_PASS
    ).toString();
  }
  try {
    const updatedUser = await Users.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete
userRoute.delete(
  "/delete/:id",
  verifyTokenAndAuthorization,
  async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.status(200).json("user has been deleted successfully!");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

userRoute.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);

    const { password, ...others } = user;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

userRoute.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = userRoute;
