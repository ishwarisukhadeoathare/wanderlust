const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware.js");

const reviewController=require("../controllers/reviews.js");
const review=require("../models/review.js");

// Add a comment
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete a comment
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
