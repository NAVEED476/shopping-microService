const Users = require("../Models/userSchema");
const CryptoJs = require("crypto-js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
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
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const existingUser = await Users.findOne({ username: req.body.username });
    if (!existingUser) {
      return res.status(400).json("User not found");
    }

    const decryptedPassword = CryptoJs.AES.decrypt(
      existingUser.password,
      process.env.SEC_PASS
    ).toString(CryptoJs.enc.Utf8);
    if (decryptedPassword !== req.body.password) {
      return res.status(400).json("Wrong password");
    }
    const accesstoken = jwt.sign(
      { id: existingUser._id, isAdmin: existingUser.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );
    const {password, ...others} = existingUser._doc;
    res.status(200).json({ ...others, accesstoken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
