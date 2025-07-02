
const User = require("../models/user.js");
const Listing = require('../models/listing.js');


module.exports.renderSignup= (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup =async(req,res)=>{
    try{
        let {username,email,password}=  req.body;
        let newUser =  new User({email,username});
        const registerUser= await User.register(newUser,password);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success",`Welcome! ${username} to Excursia.`);
            let redirectUrl =res.locals.redirectUrl || '/listings';
            res.redirect(redirectUrl);
        });
        
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.login = async(req,res)=>{
    let {username,password} = req.body;
    req.flash("success",`Logged In! Welcome back ${username}`);
    let redirectUrl =res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out Successfully!");
        res.redirect("/listings");
    });
   
}

module.exports.showProfile = async (req, res, next) => {
    try {
        let { username } = req.params;
        const user = await User.findOne({ username });
        const email = user.email;

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/");
        }

        const totalListings = await Listing.find({ owner: user._id }); 

        res.render("users/userProfile.ejs", { username, email,totalListings });
    } catch (err) {
        next(err);
    }
};