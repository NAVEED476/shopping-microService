const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const authRoutes = require("./routes/AuthRoutes");
const productRoute = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoutes");
const stripeRoute = require("./routes/Stripe.js");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connection is successful");
  })
  .catch((err) => console.log(err));
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/checkout", stripeRoute);

app.listen(5000, () => {
  console.log("app running at 5000");
});
