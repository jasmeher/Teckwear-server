const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// @desc get all orders
// @route GET/order
// @access Private
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().lean();

  if (!orders?.length) {
    return res.status(400).json({ message: "No orders found" });
  }

  const orderWithUser = await Promise.all(
    orders.map(async (order) => {
      const user = await User.findById(order.user).lean().exec();
      return { ...order, user: user.username };
    })
  );

  const orderWithProduct = await Promise.all(
    orderWithUser.map(async (order) => {
      const product = await Product.findById(order.product).lean().exec();
      return { ...order, product: product.BIproductname };
    })
  );

  res.json(orderWithProduct);
});

// @desc create new order
// @route POST/order
// @access Private
const createNewOrder = asyncHandler(async (req, res) => {
  const { user, product, qty, address, paymentMethod } = req.body;

  if (!user || !product || !qty || !address || !paymentMethod) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const order = await Order.create({
    user,
    product,
    qty,
    address,
    paymentMethod,
  });
  if (order) {
    return res.status(201).json({ message: "New Order Created!" });
  } else {
    return res.status(400).json({ message: "Invalid Order Data Recieved" });
  }
});

module.exports = {
  getOrders,
  createNewOrder,
};

// @desc update order
// @route PATCH/order
// @access Private
const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed, user, product, qty, address, paymentMethod } = req.body;

  if (
    !id ||
    typeof completed !== "boolean" ||
    !user ||
    !product ||
    !qty ||
    !address ||
    !paymentMethod
  ) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const order = await Order.findById(id).exec();

  if (!order) {
    return res.status(400).json({ message: "Order not found" });
  }

  order.user = user;
  order.completed = completed;
  order.product = product;
  order.qty = qty;
  order.address = address;
  order.paymentMethod = paymentMethod;

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
