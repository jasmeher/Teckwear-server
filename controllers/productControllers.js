const Product = require("./../models/Product");
const asyncHandler = require("express-async-handler");

// @desc Get all Products
// @route GET /product
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().lean();

  if (!products?.length) {
    return res.status(400).json({ message: "No Products found!" });
  }

  res.json(products);
});

// @desc Get Single Product
// @route GET /product/:id
// @access Public
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID required" });
  }

  const product = await Product.findById(id).lean();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  res.json(product);
});

// @desc Create new Product
// @route POST /product
// @access Private
const createProduct = asyncHandler(async (req, res) => {
  const {
    img,
    BIproductname,
    BIgender,
    BIcategory,
    BIcolor,
    BIsize,
    BIqty,
    BIprice,
    description,
  } = req.body;

  //confirm data for product
  if (
    !Array.isArray(img) ||
    !img.length ||
    !BIproductname ||
    !BIgender ||
    !BIcategory ||
    !BIcolor ||
    !BIsize ||
    !BIqty ||
    !BIprice ||
    !description
  ) {
    return res.status(400).json({ message: "All Fields are required!" });
  }

  //Check if product already exists

  const duplicate = await Product.findOne({ BIproductname }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Product name!" });
  }

  const productObject = {
    img,
    BIproductname,
    BIgender,
    BIcategory,
    BIcolor,
    BIsize,
    BIqty,
    BIprice,
    description,
  };
  // create and store the product
  const product = await Product.create(productObject);

  if (product) {
    //success
    return res.status(201).json({ message: "Product created successfully!" });
  } else {
    //error
    return res.status(400).json({ message: "Invalid Product" });
  }
});

// @desc Edit Product
// @route PATCH /product
// @access Private
const editProduct = asyncHandler(async (req, res) => {
  const {
    id,
    img,
    BIproductname,
    BIgender,
    BIcategory,
    BIcolor,
    BIsize,
    BIqty,
    BIprice,
    description,
    status,
  } = req.body;

  //confirm data for product
  if (
    !id ||
    !Array.isArray(img) ||
    !img.length ||
    !BIproductname ||
    !BIgender ||
    !BIcategory ||
    !BIsize ||
    !Array.isArray(BIcolor) ||
    !BIcolor.length ||
    !BIqty ||
    !BIprice ||
    !description ||
    !status
  ) {
    return res.status(400).json({ message: "All Fields are required!" });
  }

  const product = await Product.findById(id).exec();
  // check if there is a product
  if (!product) {
    return res.status(400).json({ message: "Product not found!" });
  }
  //check duplicate
  const duplicate = await Product.findOne({ BIproductname }).lean().exec();

  //Allow update to original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Product name" });
  }

  product.img = img;
  product.BIproductname = BIproductname;
  product.BIgender = BIgender;
  product.BIcategory = BIcategory;
  product.BIcolor = BIcolor;
  product.BIsize = BIsize;
  product.BIqty = BIqty;
  product.BIprice = BIprice;
  product.description = description;
  product.status = status;

  const updatedProduct = await product.save();

  res.json({ message: `Product ${BIproductname} updated successfully!` });
});

// @desc Delete Product
// @route DELETE /product
// @access Private
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Product ID required" });
  }

  const product = await Product.findById(id).exec();

  if (!product) {
    return res.status(400).json({ message: "Product not found" });
  }

  const result = await product.deleteOne();

  const reply = `Product ${result.BIproductname} with ID ${result._id} has been deleted successfully`;

  res.json(reply);
});

module.exports = {
  getAllProducts,
  createProduct,
  editProduct,
  deleteProduct,
  getSingleProduct,
};
