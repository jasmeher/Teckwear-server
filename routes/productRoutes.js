const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");

router
  .route("/")
  .get(productControllers.getAllProducts)
  .get(productControllers.getSingleProduct)
  .post(productControllers.createProduct)
  .patch(productControllers.editProduct)
  .delete(productControllers.deleteProduct);

router.route("/single/:id").get(productControllers.getSingleProduct);

module.exports = router;
