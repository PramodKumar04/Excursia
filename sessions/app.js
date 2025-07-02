const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path =require("path");

const sessionOptions={secret:"mysecretstring", resave:false,saveUninitialized:true};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,'views'));

app.use(session(sessionOptions));
app.use(flash());

// app.get("/cookie",(req,res)=>{
//     res.send("test successful");
// });

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//          req.session.count=1;
//     }
//     console.log(req.session.count);
//     res.send(`you sent a request ${req.session.count} times`);
// });

app.get("/register",(req,res)=>{
    let {name ="anonymous"}=req.query;
    req.session.name=name;
    user=name;
    if(user==="anonymous"){
        req.flash('failure','user not registered');
    }
    else{
        req.flash('success','user registered successfully');
    }
    
    
    console.log(req.session);
    res.send(name);
});

app.get("/hello",(req,res)=>{
    res.locals.sucMsg= req.flash("success");
    res.locals.errMsg= req.flash("error")
    res.render("page.ejs",{name: req.session.name});
    

})

app.listen(3000,()=>{
    console.log('server is listening to 3000');
});
