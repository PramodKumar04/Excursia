const express = require("express");
const router=  express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controller/user.js');
router.use(express.urlencoded({ extended: true })); 
router.use(express.json());                         


router
    .route("/signup")
    .get(userController.renderSignup)
    .post(saveRedirectUrl, wrapAsync(userController.signup));

router
    .route("/login")
    .get((req,res)=>{
        res.render("users/login.ejs");
    })
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:'/login',failureFlash:true}),userController.login);

router.get("/logout", userController.logout);

router.get("/:username",userController.showProfile);



module.exports = router;

