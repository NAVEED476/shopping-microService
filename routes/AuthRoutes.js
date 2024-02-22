const express = require("express");
const CryptoJs = require("crypto-js");
const Users = require("../Models/userSchema");
const jwt = require("jsonwebtoken");

const AuthRoutes = express.Router();

AuthRoutes.post("/register", async (req, res) => {
  const newUser = new Users({
    username: req.body.username,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.SEC_PASS
    ).toString(),
  });

  try {
    const checkExistingUser = await Users.findOne({username:req.body.username})
    if(checkExistingUser){
      res.status(400).json("user is already Exist")
    }
    const savedUser = await newUser.save();
    const {password, ...others} = savedUser._doc;
    res.status(201).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

AuthRoutes.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("User not found");
    }

    const decryptedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.SEC_PASS
    ).toString(CryptoJs.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Wrong password");
    }

    const accesstoken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accesstoken });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = AuthRoutes;
