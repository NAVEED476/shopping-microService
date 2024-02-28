const Users = require("../Models/userSchema");
const { verifyTokenAndAuthorization } = require("./VerifyToken");
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

module.exports = userRoute;
