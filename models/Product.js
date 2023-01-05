const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    img: [
      {
        type: String,
      },
    ],
    BIproductname: {
      type: String,
      required: false,
    },
    BIgender: {
      type: String,
      required: true,
    },
    BIcategory: {
      type: String,
      required: true,
    },
    BIcolor: {
      type: String,
    },
    BIsize: {
      type: String,
    },
    BIqty: {
      type: Number,
    },
    BIprice: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "active",
    },
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);

// description: {
//   type: String,
//   get: function (description) {
//     try {
//       return JSON.parse(description);
//     } catch (error) {
//       return description;
//     }
//   },
//   set: function (description) {
//     return JSON.stringify(description);
//   },
// },
