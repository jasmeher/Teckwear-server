const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const verifyJWT = require("../middleware/verifyJWT");

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(verifyJWT, reviewController.createReview);

router
  .route("/single/:id")
  .patch(verifyJWT, reviewController.editReview)
  .delete(verifyJWT, reviewController.deleteReview);

module.exports = router;
