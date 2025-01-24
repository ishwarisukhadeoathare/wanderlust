const Listing=require("./models/listing");
const Review=require("./models/review");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema, reviewSchema}=require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in.");
    return res.redirect("/login");
  }
  next();
};
  module.exports.saveRedirectUrl=(req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
  };

  module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
  
    // Check if the current user is the owner of the listing
    if (!listing.owner.equals(res.locals.currUser._id)) {
      req.flash("error", "You are not the owner of this listing.");
      return res.redirect(`/listings/${id}`);
    }
  
    next(); // Proceed to the next middleware or route handler
  };
  
  

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }
    next();
  };

  // Middleware to validate review
  module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    }else{
      next();
    }
    
  };

module.exports.isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  const review = await Review.findById(reviewId);
if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized to delete this review.");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
