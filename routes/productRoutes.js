const express = require("express");
const router = express.Router();
const productControllers = require("../controllers/productControllers");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(productControllers.getAllProducts)
  .get(productControllers.getSingleProduct)
  .post(productControllers.createProduct)
  .patch(productControllers.editProduct);

router
  .route("/single/:id")
  .get(productControllers.getSingleProduct)
  .delete(productControllers.deleteProduct);

module.exports = router;
