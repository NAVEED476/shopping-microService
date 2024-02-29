const stripeRoute = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_KEY);

stripeRoute.post("/payment", (req, res) => {
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      token:req.body.token,
      currency: "usd",
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        res.status(500).json(stripeErr);
      } else {
        res.status(200).json(stripeRes);
      }
    }
  );
});

module.exports = stripeRoute;
