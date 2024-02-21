const express = require("express");
const CryptoJs = require("crypto-js");
const Users = require("../Models/userSchema");

const AuthRoutes = express.Router();

AuthRoutes.post("/register", async (req, res) => {
  const newUser = new Users({
    username: req.body.username,
    email: req.body.email,
    mobileNumber: req.body.mobileNumber,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.SEC_PASS).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
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
    
    const decryptedPassword = CryptoJs.AES.decrypt(user.password, process.env.SEC_PASS).toString(CryptoJs.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      return res.status(401).json("Wrong password");
    }
     
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = AuthRoutes;
