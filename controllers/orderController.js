const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// @desc get all orders
// @route GET/order
// @access Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort("-createdAt").lean();
  const { query } = req;

  if (!orders?.length) {
    return res.status(400).json({ message: "No orders found" });
  }
  if (query.userId !== undefined) {
    let filteredOrders;
    for (key in query) {
      filteredOrders = orders.filter(
        (order) => order.user.toString() === query[key]
      );
    }
    return res.json(filteredOrders);
  }

  res.json(orders);
});

// @desc create new order
// @route POST/order
// @access Private
const createNewOrder = asyncHandler(async (req, res) => {
  const { user, product, email } = req.body;

  if (!user || !product || !email) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  //retrieve product information

  const lineItems = await Promise.all(
    product.map(async (item) => {
      const product = await Product.findById(item.id);
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: product.BIproductname,
            images: product.img,
          },
          unit_amount: product.BIprice * 100,
        },
        quantity: item.qty,
      };
    })
  );

  //stripe session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: email,
    mode: "payment",
    success_url: `http://localhost:3000/?success=true&session={CHECKOUT_SESSION_ID}`,
    cancel_url: "http://localhost:3000/?cancelled=true",
    line_items: lineItems,
    shipping_address_collection: { allowed_countries: ["US", "IN", "CA"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "inr" },
          display_name: "Free shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      },
    ],
  });

  // create order

  const order = await Order.create({
    user,
    product,
    email,
    stripeSessionId: session.id,
  });
  return res.json({ id: session.id });
});

// @desc update order
// @route PATCH/order
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({ message: "Session Id required" });
  }

  const order = await Order.findOne({ stripeSessionId: sessionId }).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  order.completed = true;
  const productList = await Promise.all(
    order.product.map(async (product) => {
      const item = await Product.findById(product.id).exec();
      item.sales += product.qty;
      item.BIqty -= product.qty;

      const updatedItem = await item.save();
    })
  );

  const getUser = await User.findById(order.user).lean().exec();

  const updatedOrder = await order.save();

  res.json(`Order of ${getUser.username} with order ID ${order.id} is Updated`);
});

// @desc delete order
// @route DELETE/order
// @access Private
const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Order ID required" });
  }

  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  const result = await order.deleteOne();

  res.json(`Order ${result._id} deleted Successfuly`);
});

module.exports = {
  getOrders,
  createNewOrder,
  updateOrder,
  deleteOrder,
};
