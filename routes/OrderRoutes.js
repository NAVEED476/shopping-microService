const orderRoutes = require("express").Router();
const { Aggregate } = require("mongoose");
const Orders = require("../Models/OrderSchema");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./VerifyToken");

// create
orderRoutes.post("/", verifyToken, async (req, res) => {
  const OrderProduct = new Orders(req.body);

  try {
    const OrderItem = await OrderProduct.save();
    res.status(200).json(OrderItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update Order
orderRoutes.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateOrder = await Orders.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
    });
    res.status(200).json(updateOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete cartItem
orderRoutes.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Orders.findByIdAndDelete(req.params.id);
    res.status(200).json("order item deleted successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user Orders
orderRoutes.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const OrderItem = await Orders.find(req.params.id);
    res.status(200).json(OrderItem);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all cart Items

orderRoutes.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orderedItems = await Orders.find();
    res.status(200).json(orderedItems);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get Monthly income

orderRoutes.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const PrevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  try {
    const income = await Orders.aggregate([
      { $match: { createdAt: { $gte: PrevMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = orderRoutes;
