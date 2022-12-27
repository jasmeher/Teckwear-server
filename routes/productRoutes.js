const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(productControllers.getAllProducts)
  .get(productControllers.getSingleProduct)
  .post(verifyJWT, productControllers.createProduct)
  .patch(verifyJWT, productControllers.editProduct);

router
  .route("/single/:id")
  .get(productControllers.getSingleProduct)
  .delete(verifyJWT, productControllers.deleteProduct);

module.exports = router;
