if(process.env.NODE_ENV !='production'){
    require('dotenv').config();
}


// console.log(process.env);

const express =require ('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate =require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter= require('./routes/user.js');
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy= require("passport-local");
const User =require("./models/user.js");



const sessionOptions={secret:process.env.SECRET, resave:false,saveUninitialized:true,
                      cookie:{
                        expires: Date.now()+7*24*60*60*1000,
                        maxAge: 7*24*60*60*1000,
                        httpOnly: true
                      }
};

app.set('view engine', 'ejs');
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

main().catch(err => console.log(err));

async function main() {
    
    console.log("Connected to MongoDB");
}

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    // console.log(res.locals.success);
    next();
});



//route for listings
app.use("/listings",listingRouter);

//route for reviews
app.use("/listings/:id/reviews",reviewRouter);

//route for users
app.use("/",userRouter); 

app.all(/.*/, (req, res, next) => {//all other routes which are not defined
    next(new ExpressError("404: Page not found", 404));
});

// error
app.use((err, req, res, next) => {
    let {statusCode=500,message="Something went wrong"} = err;
    res.status(statusCode).render('error.ejs', { err});
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
