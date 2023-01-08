const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(orderController.getOrders)
  .post(orderController.createNewOrder);

router.route("/single/:id").delete(orderController.deleteOrder);

router.route("/single/:sessionId").patch(orderController.updateOrder);

module.exports = router;
