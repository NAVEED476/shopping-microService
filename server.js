const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const userRoute = require("./routes/userRoutes");
const authRoutes = require("./routes/AuthRoutes");
dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("db connection is successful");
  })
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
  console.log("app running at 5000");
});
