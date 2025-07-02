const express =require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema,reviewSchema } = require('../schema.js');
const ExpressError=require('../utils/ExpressError.js');
const flash = require("connect-flash");
const {isLoggedIn, isOwner} = require("../middleware.js");
const multer  = require('multer');
const {storage}= require('../cloudConfig.js')
const upload = multer({storage});



const listingController = require('../controller/listing.js');


function validateListing(req, res, next)  {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg=error.details.map(el => el.message).join(',');
        throw new ExpressError(errMsg, 400);
    }
    else{
        next();
    }
};


router.get("/new",isLoggedIn, listingController.renderNewForm);

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(upload.single("image"),wrapAsync(listingController.createListing));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("image"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));
    
//fiter
router.get("/category/:filter", async (req, res) => {
  const { filter } = req.params;
  const listings = await Listing.find({ category: filter });
  res.render("listings/filter.ejs", { listings, currentFilter: filter });
});




//show update
router.get("/:id/edit",isOwner, wrapAsync(listingController.showUpdated));



module.exports = router;