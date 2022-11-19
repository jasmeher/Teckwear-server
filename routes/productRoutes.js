const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");

router
  .route("/")
  .get(productControllers.getAllProducts)
  .post(productControllers.createProduct)
  .patch(productControllers.editProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
