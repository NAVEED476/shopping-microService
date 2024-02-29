const { verifyTokenAndAdmin } = require("./VerifyToken");
const Product = require("../Models/ProductSchema");
const productRoute = require("express").Router();

// Create
productRoute.post("/create", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const saveNewProduct = await newProduct.save();
    res.status(200).json(saveNewProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update
productRoute.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateddProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updateddProduct);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete Product

productRoute.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("product deleted successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

//get Product

productRoute.get("/:id", async (req, res) => {
  try {
    const getProduct = await Product.findById(req.params.id);
    res.status(200).json(getProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

productRoute.get("/", async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: 1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = productRoute;
