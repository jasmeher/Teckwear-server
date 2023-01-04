const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: String,
      get: function (product) {
        try {
          return JSON.parse(product);
        } catch (error) {
          return product;
        }
      },
      set: function (product) {
        return JSON.stringify(product);
      },
    },
    email: {
      type: String,
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Orders", OrderSchema);
