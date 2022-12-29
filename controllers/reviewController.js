const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

//@desc get all Reviews
//@route GET/review
//@access Public
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().lean();

  if (!reviews?.length) {
    return res.status(400).json({ message: "No reviews found" });
  }

  const reviewWithUser = await Promise.all(
    reviews.map(async (review) => {
      const user = await User.findById(review.user).lean().exec();
      return { ...review, user: user.username };
    })
  );

  const reviewWithProduct = await Promise.all(
    reviewWithUser.map(async (review) => {
      const product = await Product.findById(review.product).lean().exec();
      return { ...review, product: product.BIproductname };
    })
  );

  res.json(reviewWithProduct);
});

//@desc create new review
//@route POST/review
//@access Private
const createReview = asyncHandler(async (req, res) => {
  const { user, product, title, review, rating } = req.body;

  if (!user || !product || !title || !review || !rating) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const duplicate = await Review.findOne({ product });

  if (duplicate) {
    return res.status(409).json({ message: "Already Reviewed this product" });
  }

  const reviewObject = {
    user,
    product,
    title,
    review,
    rating,
  };

  const newReview = await Review.create(reviewObject);

  if (newReview) {
    const findProduct = await Product.findById(product);
    return res.status(201).json({
      message: `Review of ${findProduct.BIproductname} created Successfully!`,
    });
  } else {
    return res.status(400).json({ message: "Invalid Review Data" });
  }
});

//@desc edit review
//@route PATCH/review/single/:id
//@access Private
const editReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, review, rating, product } = req.body;

  if (!id || !title || !review || !rating) {
    return res.status(400).json({ message: "All Fields are required" });
  }

  const checkReview = await Review.findById(id).exec();

  if (!checkReview) {
    return res.status(400).json({ message: "Review not found" });
  }

  checkReview.title = title;
  checkReview.rating = rating;
  checkReview.review = review;

  const updateReview = await checkReview.save();

  const findProduct = await Product.findById(product);
  res.json({
    message: `Review of ${findProduct.BIproductname} Edited Successfully!`,
  });
});

//@desc Delete Review
//@route DELETE/review/single/:id
//@access Private
const deleteReview = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Review ID required" });
  }

  const review = await Review.findById(id).exec();

  if (!review) {
    return res.status(400).json({ message: "Review not found" });
  }

  const result = await review.deleteOne();
  const reply = `Review ${result.title} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllReviews,
  editReview,
  createReview,
  deleteReview,
};
