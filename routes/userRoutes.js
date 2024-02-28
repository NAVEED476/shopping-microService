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

    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Users
userRoute.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get User Stats

userRoute.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await Users.aggregate([
      {
        $match: {
          createdAt: { $gte: lastYear }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 }
        }
      },
      {
        $sort: {
          "_id": 1
        }
      }
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = userRoute;
