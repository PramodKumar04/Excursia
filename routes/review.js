const express = require('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Listing = require('../models/listing.js');
const { reviewSchema } = require('../schema.js');
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const flash = require("connect-flash");
const { isLoggedIn } = require('../middleware.js');
const { isReviewAuthor } = require('../middleware.js');
const reviewController =require('../controller/review.js');

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    }
    next();
};


//Reviews
//POST route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//DELETE route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor ,  wrapAsync(reviewController.deleteReview));


module.exports=router;