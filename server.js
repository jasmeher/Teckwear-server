const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connection = require("./config/connection");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.use(express.static(process.env.STATIC_DIR));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", function (req, res) {
  res.send(`Server is listening on port ${process.env.PORT}`);
});
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: "inr",
      amount: 1900,
      description: "Testing",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    return res.status(400).json({
      error: {
        message: error.message,
      },
    });
  }
});

app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/product", require("./routes/productRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/review", require("./routes/reviewRoutes"));

app.listen(process.env.PORT);
