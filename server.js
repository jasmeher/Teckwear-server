const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const connection = require("./config/connection");
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.get("/", function (req, res) {
  res.send(`Server is listening on port ${process.env.PORT}`);
});
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/product", require("./routes/productRoutes"));
app.use("/order", require("./routes/orderRoutes"));
app.use("/review", require("./routes/reviewRoutes"));

app.listen(process.env.PORT);
