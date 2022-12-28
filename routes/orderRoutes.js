const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);

router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.createNewOrder);

router
  .route("/single/:id")
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

module.exports = router;
